import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "@repo/auth/passport";
import { prisma } from "@repo/db/client";
import { JWT_SECRET } from "@repo/auth/config";
import { auth } from "@repo/auth/middleware";
import { z } from "zod";
import { CustomRequest, Sport, Gender } from "../types";
import { LeaderboardService } from "../services/leaderboard";
import { AIFeedbackService } from "../services/aiFeedback";

const router: Router = Router();

const officialSignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  gender: z.nativeEnum(Gender, "Invalid gender"),
  sport: z.nativeEnum(Sport, "Invalid sport"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const officialSigninSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

const athleteIdParamSchema = z.object({
  athleteId: z.string().cuid("Invalid athleteId")
});

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, sport, password } = officialSignupSchema.parse(req.body);

    const passwordHash = await bcrypt.hash(password, 10);
    const official = await prisma.official.create({
      data: { 
        firstName, 
        lastName, 
        email, 
        phone, 
        gender, 
        sport, 
        passwordHash 
      } as any
    });

    res.json({ 
      success: true,
      official: {
        id: official.id, 
        firstName: (official as any).firstName, 
        lastName: (official as any).lastName,
        email: official.email,
        sport: (official as any).sport
      }
    });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    if (err.code === 'P2002') {
      return res.status(400).json({ message: "Email or phone number already exists" });
    }
    res.status(500).json({ message: "Official signup failed", error: err });
  }
});

router.post("/signin", (req, res, next) => {
  try {
    officialSigninSchema.parse(req.body);
  } catch (err: any) {
    return res.status(400).json({ message: "Validation failed", errors: err.issues });
  }

  passport.authenticate(
    "official-local",
    { session: false },
    (err: any, user: { id: string } | false, info: { message?: string }) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ message: info?.message || "Official signin failed" });
      }
      const token = jwt.sign({ sub: user.id, role: "official" }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ 
        success: true,
        token,
        message: "Signin successful"
      });
    }
  )(req, res, next);
});

router.get("/athletes", auth("official"), async (req: CustomRequest, res) => {
  try {
    const official = await prisma.official.findUnique({
      where: { id: req.userId! },
      select: { sport: true } as any
    });

    if (!official) {
      return res.status(404).json({ message: "Official not found" });
    }

    const athletes = await prisma.athlete.findMany({
      where: { sport: (official as any).sport } as any,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        age: true,
        gender: true,
        sport: true,
        createdAt: true
      } as any
    });

    res.json({ 
      success: true, 
      athletes,
      sport: (official as any).sport,
      count: athletes.length,
      message: `Found ${athletes.length} athletes in ${(official as any).sport}`
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch athletes", error: err });
  }
});

router.get("/athletes/tests", auth("official"), async (req: CustomRequest, res) => {
  try {
    const official = await prisma.official.findUnique({
      where: { id: req.userId! },
      select: { sport: true } as any
    });

    if (!official) {
      return res.status(404).json({ message: "Official not found" });
    }

    const athletes = await prisma.athlete.findMany({
      where: { sport: (official as any).sport } as any,
      include: {
        standardizedTests: {
          orderBy: { testDate: 'desc' }
        },
        psychologicalAssessments: {
          orderBy: { assessmentDate: 'desc' }
        }
      } as any
    });

    const sportModelName = `${(official as any).sport?.charAt(0) + (official as any).sport?.slice(1).toLowerCase()}Test`;
    const sportTests = await (prisma as any)[sportModelName].findMany({
      where: {
        athlete: { sport: (official as any).sport } as any
      } as any,
      include: {
        athlete: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            sport: true
          } as any
        }
      },
      orderBy: { testDate: 'desc' }
    });

    res.json({
      success: true,
      sport: official.sport,
      athletes: athletes.map(athlete => ({
        id: athlete.id,
        firstName: (athlete as any).firstName,
        lastName: (athlete as any).lastName,
        email: athlete.email,
        age: (athlete as any).age,
        gender: (athlete as any).gender,
        sport: (athlete as any).sport,
        testHistory: {
          standardized: {
            count: (athlete as any).standardizedTests?.length || 0,
            latest: (athlete as any).standardizedTests?.[0] || null,
            all: (athlete as any).standardizedTests || []
          },
          psychological: {
            count: (athlete as any).psychologicalAssessments?.length || 0,
            latest: (athlete as any).psychologicalAssessments?.[0] || null,
            all: (athlete as any).psychologicalAssessments || []
          },
          sportSpecific: {
            count: sportTests.filter((test: any) => test.athleteId === athlete.id).length,
            latest: sportTests.find((test: any) => test.athleteId === athlete.id) || null,
            all: sportTests.filter((test: any) => test.athleteId === athlete.id)
          }
        },
        summary: {
          totalTests: ((athlete as any).standardizedTests?.length || 0) + ((athlete as any).psychologicalAssessments?.length || 0) + sportTests.filter((test: any) => test.athleteId === athlete.id).length,
          lastTestDate: Math.max(
            (athlete as any).standardizedTests?.[0]?.testDate?.getTime() || 0,
            (athlete as any).psychologicalAssessments?.[0]?.assessmentDate?.getTime() || 0,
            sportTests.find((test: any) => test.athleteId === athlete.id)?.testDate?.getTime() || 0
          )
        }
      })),
      sportTests,
      message: `Test results for all ${(official as any).sport} athletes`
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all test results", error: err });
  }
});

router.get("/athletes/:athleteId/tests", auth("official"), async (req: CustomRequest, res) => {
  try {
    const { athleteId } = athleteIdParamSchema.parse(req.params);

    const official = await prisma.official.findUnique({
      where: { id: req.userId! },
      select: { sport: true } as any
    });

    if (!official) {
      return res.status(404).json({ message: "Official not found" });
    }

    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      include: {
        standardizedTests: {
          orderBy: { testDate: 'desc' }
        },
        psychologicalAssessments: {
          orderBy: { assessmentDate: 'desc' }
        }
      } as any
    });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    if ((athlete as any).sport !== (official as any).sport) {
      return res.status(403).json({ message: "Access denied: Athlete is not in your sport" });
    }

    const sportModelName = `${(athlete as any).sport.charAt(0) + (athlete as any).sport.slice(1).toLowerCase()}Test`;
    const sportTests = await (prisma as any)[sportModelName].findMany({
      where: { athleteId },
      orderBy: { testDate: 'desc' }
    });

    res.json({
      success: true,
      athlete: {
        id: athlete.id,
        firstName: (athlete as any).firstName,
        lastName: (athlete as any).lastName,
        email: athlete.email,
        age: (athlete as any).age,
        gender: (athlete as any).gender,
        sport: (athlete as any).sport
      },
      testHistory: {
        standardized: {
          count: (athlete as any).standardizedTests?.length || 0,
          latest: (athlete as any).standardizedTests?.[0] || null,
          all: (athlete as any).standardizedTests || []
        },
        psychological: {
          count: (athlete as any).psychologicalAssessments?.length || 0,
          latest: (athlete as any).psychologicalAssessments?.[0] || null,
          all: (athlete as any).psychologicalAssessments || []
        },
        sportSpecific: {
          count: sportTests.length,
          latest: sportTests[0] || null,
          all: sportTests
        }
      },
      summary: {
        totalTests: ((athlete as any).standardizedTests?.length || 0) + ((athlete as any).psychologicalAssessments?.length || 0) + sportTests.length,
        lastTestDate: Math.max(
          (athlete as any).standardizedTests?.[0]?.testDate?.getTime() || 0,
          (athlete as any).psychologicalAssessments?.[0]?.assessmentDate?.getTime() || 0,
          sportTests[0]?.testDate?.getTime() || 0
        )
      },
      message: `Test history for ${(athlete as any).firstName} ${(athlete as any).lastName}`
    });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    res.status(500).json({ message: "Failed to fetch athlete test history", error: err });
  }
});

router.get("/leaderboard", auth("official"), async (req: CustomRequest, res) => {
  try {
    const official = await prisma.official.findUnique({
      where: { id: req.userId! },
      select: { sport: true } as any
    });

    if (!official) {
      return res.status(404).json({ message: "Official not found" });
    }

    const leaderboard = await LeaderboardService.getSportLeaderboard((official as any).sport);

    res.json({
      success: true,
      sport: (official as any).sport,
      leaderboard,
      message: `Leaderboard for ${(official as any).sport} athletes`
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leaderboard", error: err });
  }
});

router.get("/athletes/:athleteId/feedback", auth("official"), async (req: CustomRequest, res) => {
  try {
    const { athleteId } = athleteIdParamSchema.parse(req.params);

    const official = await prisma.official.findUnique({
      where: { id: req.userId! },
      select: { sport: true } as any
    });

    if (!official) {
      return res.status(404).json({ message: "Official not found" });
    }

    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      select: { id: true, sport: true, firstName: true, lastName: true } as any
    });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    if ((athlete as any).sport !== (official as any).sport) {
      return res.status(403).json({ message: "Access denied: Athlete is not in your sport" });
    }

    const report = await AIFeedbackService.generateAthleteReport(athleteId!);

    res.json({
      success: true,
      report,
      message: `AI feedback report generated for ${(athlete as any).firstName} ${(athlete as any).lastName}`
    });
  } catch (err: any) {
    if (err.message === 'Athlete not found') {
      return res.status(404).json({ message: "Athlete not found" });
    }
    if (err?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    res.status(500).json({ message: "Failed to generate AI feedback report", error: err });
  }
});

router.get("/athletes/feedback", auth("official"), async (req: CustomRequest, res) => {
  try {
    const official = await prisma.official.findUnique({
      where: { id: req.userId! },
      select: { sport: true } as any
    });

    if (!official) {
      return res.status(404).json({ message: "Official not found" });
    }

    const athletes = await prisma.athlete.findMany({
      where: { sport: (official as any).sport } as any,
      select: { id: true, firstName: true, lastName: true } as any
    });

    if (athletes.length === 0) {
      return res.json({
        success: true,
        reports: [],
        message: "No athletes found in your sport"
      });
    }

    const maxReports = 10;
    const athletesToProcess = athletes.slice(0, maxReports);
    
    const reports = await Promise.all(
      athletesToProcess.map(async (athlete) => {
        try {
          const report = await AIFeedbackService.generateAthleteReport((athlete as any).id);
          return report;
        } catch (error) {
          console.error(`Failed to generate report for athlete ${(athlete as any).id}:`, error);
          return null;
        }
      })
    );

    const successfulReports = reports.filter(report => report !== null);

    res.json({
      success: true,
      reports: successfulReports,
      totalAthletes: athletes.length,
      processedAthletes: successfulReports.length,
      message: `AI feedback reports generated for ${successfulReports.length} athletes in ${official.sport}`
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate AI feedback reports", error: err });
  }
});

export default router;