import { Router } from "express";
import { prisma } from "@repo/db/client";
import { auth } from "@repo/auth/middleware";
import { z } from "zod";
import { CustomRequest } from "../types";

const router: Router = Router();

// ---------- Zod Schemas ----------

// For storing test result
const storeResultSchema = z.object({
  testType: z.string().min(1, "Test type is required"),
  metrics: z.any() 
});

// For official fetching a specific athlete's results
const athleteIdParamSchema = z.object({
  athleteId: z.string().cuid("Invalid athleteId")
});

// ---------- Routes ----------

// Athlete: Store test result from on-device ML
router.post("/store", auth("athlete"), async (req: CustomRequest, res) => {
  try {
    const { testType, metrics } = storeResultSchema.parse(req.body);

    const result = await prisma.testResult.create({
      data: {
        session: {
          create: { athleteId: req.userId! }
        },
        testType,
        metrics
      },
      include: { session: true }
    });

    res.json({ success: true, result });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    res.status(500).json({ message: "Failed to store result", error: err });
  }
});

// Athlete: View own results
router.get("/my-results", auth("athlete"), async (req: CustomRequest, res) => {
  try {
    const results = await prisma.testResult.findMany({
      where: { session: { athleteId: req.userId! } },
      include: { session: true },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch results", error: err });
  }
});

// Official: View all athletes' results
router.get("/all", auth("official"), async (_req, res) => {
  try {
    const results = await prisma.testResult.findMany({
      include: { 
        session: { 
          include: { 
            athlete: {
              select: {
                id: true,
                name: true,
                email: true,
                age: true,
                createdAt: true,
                updatedAt: true
                // passwordHash is excluded for security
              }
            } 
          } 
        } 
      },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all results", error: err });
  }
});

// Official: View results for a specific athlete
router.get("/athlete/:athleteId", auth("official"), async (req, res) => {
  try {
    const { athleteId } = athleteIdParamSchema.parse(req.params);

    const results = await prisma.testResult.findMany({
      where: { session: { athleteId } },
      include: { 
        session: { 
          include: { 
            athlete: {
              select: {
                id: true,
                name: true,
                email: true,
                age: true,
                createdAt: true,
                updatedAt: true
                // passwordHash is excluded for security
              }
            } 
          } 
        } 
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ success: true, results });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    res.status(500).json({ message: "Failed to fetch athlete results", error: err });
  }
});

export default router;
