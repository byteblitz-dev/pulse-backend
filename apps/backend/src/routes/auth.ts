import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "@repo/auth/passport";
import { prisma } from "@repo/db/client";
import { JWT_SECRET } from "@repo/auth/config";
import { z } from "zod";

const router: Router = Router();

// ---------- Zod Schemas ----------

const athleteSignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.number().int().positive().optional()
});

const athleteSigninSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

const officialSignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const officialSigninSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

// ---------- Routes ----------

// Athlete Signup
router.post("/athlete/signup", async (req, res) => {
  try {
    const { name, email, password, age } = athleteSignupSchema.parse(req.body);

    const passwordHash = await bcrypt.hash(password, 10);
    const athlete = await prisma.athlete.create({
      data: { name, email, age, passwordHash }
    });

    res.json({ id: athlete.id, name: athlete.name });
  } catch (err: any) {
    if (err?.issues) {
      // Zod validation errors
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    res.status(500).json({ message: "Athlete signup failed", error: err });
  }
});

// Athlete Signin
router.post("/athlete/signin", (req, res, next) => {
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
      res.json({ token });
    }
  )(req, res, next);
});

// Official Signup
router.post("/official/signup", async (req, res) => {
  try {
    const { name, email, password } = officialSignupSchema.parse(req.body);

    const passwordHash = await bcrypt.hash(password, 10);
    const official = await prisma.official.create({
      data: { name, email, passwordHash }
    });

    res.json({ id: official.id, name: official.name });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    res.status(500).json({ message: "Official signup failed", error: err });
  }
});

// Official Signin
router.post("/official/signin", (req, res, next) => {
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
      res.json({ token });
    }
  )(req, res, next);
});

export default router;
