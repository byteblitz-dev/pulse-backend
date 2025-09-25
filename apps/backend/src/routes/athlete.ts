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

const athleteSignupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().datetime("Invalid date format"),
  age: z.number().int().positive("Age must be positive"),
  gender: z.nativeEnum(Gender, "Invalid gender"),
  sport: z.nativeEnum(Sport, "Invalid sport"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const athleteSigninSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

const standardizedTestSchema = z.object({
  testDate: z.string().datetime("Invalid date format"),
  height: z.number().positive("Height must be positive"),
  weight: z.number().positive("Weight must be positive"),
  sitAndReach: z.any(),
  standingVerticalJump: z.any(),
  standingBroadJump: z.any(),
  medicineBallThrow: z.any(),
  sprint30m: z.any(),
  shuttleRun4x10m: z.any(),
  situps: z.any(),
  run800m: z.any().optional(),
  run1600m: z.any().optional()
});

const psychologicalAssessmentSchema = z.object({
  assessmentDate: z.string().datetime("Invalid date format"),
  mentalToughness: z.any(),
  competitiveAnxiety: z.any(),
  teamCohesion: z.any(),
  mentalHealth: z.any(),
  personalityTraits: z.any(),
  motivationGoals: z.any(),
  stressCoping: z.any(),
  healthScreening: z.any(),
  imageryAbility: z.any(),
  reactionTime: z.any(),
  determination: z.any(),
  timeAnticipation: z.any(),
  peripheralVision: z.any(),
  attentionAlertness: z.any(),
  sensorimotorTasks: z.any(),
  balanceTests: z.any(),
  psychomotorTasks: z.any(),
  cognitiveTasks: z.any(),
  performanceConsistency: z.any()
});

const sportTestSchema = z.object({
  testDate: z.string().datetime("Invalid date format"),
  testResults: z.any()
});

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, age, gender, sport, password } = athleteSignupSchema.parse(req.body);

    const passwordHash = await bcrypt.hash(password, 10);
    const athlete = await prisma.athlete.create({
      data: { 
        firstName, 
        lastName, 
        email, 
        phone, 
        dateOfBirth: new Date(dateOfBirth), 
        age, 
        gender, 
        sport, 
        passwordHash 
      } as any
    });

    res.json({ 
      success: true,
      athlete: {
        id: athlete.id, 
        firstName: (athlete as any).firstName, 
        lastName: (athlete as any).lastName,
        email: athlete.email,
        sport: (athlete as any).sport
      }
    });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    if (err.code === 'P2002') {
      return res.status(400).json({ message: "Email or phone number already exists" });
    }
    res.status(500).json({ message: "Athlete signup failed", error: err });
  }
});

router.post("/signin", (req, res, next) => {
  try {
    athleteSigninSchema.parse(req.body);
  } catch (err: any) {
    return res.status(400).json({ message: "Validation failed", errors: err.issues });
  }

  passport.authenticate(
    "athlete-local",
    { session: false },
    (err: any, user: { id: string } | false, info: { message?: string }) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ message: info?.message || "Athlete signin failed" });
      }
      const token = jwt.sign({ sub: user.id, role: "athlete" }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ 
        success: true,
        token,
        message: "Signin successful"
      });
    }
  )(req, res, next);
});

router.post("/tests/standardized", auth("athlete"), async (req: CustomRequest, res) => {
  try {
    const testData = standardizedTestSchema.parse(req.body);

    const { testDate, ...restData } = testData;
    const test = await (prisma as any).standardizedTest.create({
      data: {
        athleteId: req.userId!,
        testDate: new Date(testDate),
        ...restData
      }
    });

    res.json({ 
      success: true, 
      test,
      message: "Standardized test stored successfully"
    });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    res.status(500).json({ message: "Failed to store standardized test", error: err });
  }
});

router.post("/tests/psychological", auth("athlete"), async (req: CustomRequest, res) => {
  try {
    const assessmentData = psychologicalAssessmentSchema.parse(req.body);

    const { assessmentDate, ...restData } = assessmentData;
    const assessment = await (prisma as any).psychologicalAssessment.create({
      data: {
        athleteId: req.userId!,
        assessmentDate: new Date(assessmentDate),
        ...restData
      }
    });

    res.json({ 
      success: true, 
      assessment,
      message: "Psychological assessment stored successfully"
    });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    res.status(500).json({ message: "Failed to store psychological assessment", error: err });
  }
});

router.post("/tests/sport", auth("athlete"), async (req: CustomRequest, res) => {
  try {
    const testData = sportTestSchema.parse(req.body);

    const athlete = await prisma.athlete.findUnique({
      where: { id: req.userId! },
      select: { sport: true } as any
    });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    const modelName = `${(athlete as any).sport.charAt(0) + (athlete as any).sport.slice(1).toLowerCase()}Test`;
    const test = await (prisma as any)[modelName].create({
      data: {
        athleteId: req.userId!,
        testDate: new Date(testData.testDate),
        testResults: testData.testResults
      }
    });

    res.json({ 
      success: true, 
      test,
      message: "Sport-specific test stored successfully"
    });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    res.status(500).json({ message: "Failed to store sport test", error: err });
  }
});

router.get("/tests/history", auth("athlete"), async (req: CustomRequest, res) => {
  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id: req.userId! },
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

    const sportModelName = `${(athlete as any).sport.charAt(0) + (athlete as any).sport.slice(1).toLowerCase()}Test`;
    const sportTests = await (prisma as any)[sportModelName].findMany({
      where: { athleteId: req.userId! },
      orderBy: { testDate: 'desc' }
    });

    res.json({
      success: true,
      athlete: {
        id: athlete.id,
        firstName: (athlete as any).firstName,
        lastName: (athlete as any).lastName,
        sport: (athlete as any).sport,
        email: athlete.email,
        age: (athlete as any).age,
        gender: (athlete as any).gender
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
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch test history", error: err });
  }
});

router.get("/leaderboard", auth("athlete"), async (req: CustomRequest, res) => {
  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id: req.userId! },
      select: { sport: true } as any
    });

    if (!athlete) {
      return res.status(404).json({ message: "Athlete not found" });
    }

    const leaderboard = await LeaderboardService.getSportLeaderboard((athlete as any).sport);

    res.json({
      success: true,
      sport: (athlete as any).sport,
      leaderboard,
      message: `Leaderboard for ${(athlete as any).sport} athletes`
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leaderboard", error: err });
  }
});

router.get("/feedback", auth("athlete"), async (req: CustomRequest, res) => {
  try {
    const report = await AIFeedbackService.generateAthleteReport(req.userId!);

    res.json({
      success: true,
      report,
      message: "AI feedback report generated successfully"
    });
  } catch (err: any) {
    if (err.message === 'Athlete not found') {
      return res.status(404).json({ message: "Athlete not found" });
    }
    res.status(500).json({ message: "Failed to generate AI feedback report", error: err });
  }
});

export default router;