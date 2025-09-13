import { Router } from "express";
import { auth } from "@repo/auth/middleware";
import passport from "@repo/auth/passport";
import { getGenaiFeedback } from "../services/genai";
import { z } from "zod";
import { CustomRequest } from "../types";

const router: Router = Router();

const feedbackSchema = z.object({
  performanceData: z.any() 
});

// Send data to GenAI wrapper and return response (works for both athletes and officials)
router.post("/", async (req: CustomRequest, res, next) => {
  try {
    const { performanceData } = feedbackSchema.parse(req.body);

    // Try to authenticate as athlete first
    passport.authenticate("athlete-jwt", { session: false }, async (err: any, athlete: any) => {
      if (athlete) {
        // User is an athlete
        const feedback = await getGenaiFeedback(performanceData, { perspective: "athlete" });
        return res.json({ feedback });
      }

      // If not athlete, try to authenticate as official
      passport.authenticate("official-jwt", { session: false }, async (err: any, official: any) => {
        if (official) {
          // User is an official
          const feedback = await getGenaiFeedback(performanceData, { perspective: "official" });
          return res.json({ feedback });
        }

        // Neither athlete nor official - unauthorized
        return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
      })(req, res, next);
    })(req, res, next);

  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    res.status(500).json({ message: "Failed to get feedback", error: err });
  }
});

export default router;
