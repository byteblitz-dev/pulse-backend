"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("@repo/auth/passport"));
const client_1 = require("@repo/db/client");
const config_1 = require("@repo/auth/config");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// ---------- Zod Schemas ----------
const athleteSignupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    age: zod_1.z.number().int().positive().optional()
});
const athleteSigninSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required")
});
const officialSignupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters")
});
const officialSigninSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required")
});
// ---------- Routes ----------
// Athlete Signup
router.post("/athlete/signup", async (req, res) => {
    try {
        const { name, email, password, age } = athleteSignupSchema.parse(req.body);
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const athlete = await client_1.prisma.athlete.create({
            data: { name, email, age, passwordHash }
        });
        res.json({ id: athlete.id, name: athlete.name });
    }
    catch (err) {
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
    }
    catch (err) {
        return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    passport_1.default.authenticate("athlete-local", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res
                .status(400)
                .json({ message: info?.message || "Athlete signin failed" });
        }
        const token = jsonwebtoken_1.default.sign({ sub: user.id, role: "athlete" }, config_1.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    })(req, res, next);
});
// Official Signup
router.post("/official/signup", async (req, res) => {
    try {
        const { name, email, password } = officialSignupSchema.parse(req.body);
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const official = await client_1.prisma.official.create({
            data: { name, email, passwordHash }
        });
        res.json({ id: official.id, name: official.name });
    }
    catch (err) {
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
    }
    catch (err) {
        return res.status(400).json({ message: "Validation failed", errors: err.issues });
    }
    passport_1.default.authenticate("official-local", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res
                .status(400)
                .json({ message: info?.message || "Official signin failed" });
        }
        const token = jsonwebtoken_1.default.sign({ sub: user.id, role: "official" }, config_1.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    })(req, res, next);
});
exports.default = router;
