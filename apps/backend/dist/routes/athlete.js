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
const middleware_1 = require("@repo/auth/middleware");
const zod_1 = require("zod");
const types_1 = require("../types");
const leaderboard_1 = require("../services/leaderboard");
const aiFeedback_1 = require("../services/aiFeedback");
const router = (0, express_1.Router)();
const athleteSignupSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, "First name is required"),
    lastName: zod_1.z.string().min(1, "Last name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().min(1, "Phone number is required"),
    dateOfBirth: zod_1.z.string().datetime("Invalid date format"),
    age: zod_1.z.number().int().positive("Age must be positive"),
    gender: zod_1.z.nativeEnum(types_1.Gender, "Invalid gender"),
    sport: zod_1.z.nativeEnum(types_1.Sport, "Invalid sport"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters")
});
const athleteSigninSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required")
});
const standardizedTestSchema = zod_1.z.object({
    testDate: zod_1.z.string().datetime("Invalid date format"),
    height: zod_1.z.number().positive("Height must be positive"),
    weight: zod_1.z.number().positive("Weight must be positive"),
    sitAndReach: zod_1.z.any(),
    standingVerticalJump: zod_1.z.any(),
    standingBroadJump: zod_1.z.any(),
    medicineBallThrow: zod_1.z.any(),
    sprint30m: zod_1.z.any(),
    shuttleRun4x10m: zod_1.z.any(),
    situps: zod_1.z.any(),
    run800m: zod_1.z.any().optional(),
    run1600m: zod_1.z.any().optional()
});
const psychologicalAssessmentSchema = zod_1.z.object({
    assessmentDate: zod_1.z.string().datetime("Invalid date format"),
    mentalToughness: zod_1.z.any(),
    competitiveAnxiety: zod_1.z.any(),
    teamCohesion: zod_1.z.any(),
    mentalHealth: zod_1.z.any(),
    personalityTraits: zod_1.z.any(),
    motivationGoals: zod_1.z.any(),
    stressCoping: zod_1.z.any(),
    healthScreening: zod_1.z.any(),
    imageryAbility: zod_1.z.any(),
    reactionTime: zod_1.z.any(),
    determination: zod_1.z.any(),
    timeAnticipation: zod_1.z.any(),
    peripheralVision: zod_1.z.any(),
    attentionAlertness: zod_1.z.any(),
    sensorimotorTasks: zod_1.z.any(),
    balanceTests: zod_1.z.any(),
    psychomotorTasks: zod_1.z.any(),
    cognitiveTasks: zod_1.z.any(),
    performanceConsistency: zod_1.z.any()
});
const sportTestSchema = zod_1.z.object({
    testDate: zod_1.z.string().datetime("Invalid date format"),
    testResults: zod_1.z.any()
});
router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dateOfBirth, age, gender, sport, password } = athleteSignupSchema.parse(req.body);
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const athlete = await client_1.prisma.athlete.create({
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
            }
        });
        res.json({
            success: true,
            athlete: {
                id: athlete.id,
                firstName: athlete.firstName,
                lastName: athlete.lastName,
                email: athlete.email,
                sport: athlete.sport
            }
        });
    }
    catch (err) {
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
        res.json({
            success: true,
            token,
            message: "Signin successful"
        });
    })(req, res, next);
});
router.post("/tests/standardized", (0, middleware_1.auth)("athlete"), async (req, res) => {
    try {
        const testData = standardizedTestSchema.parse(req.body);
        const { testDate, ...restData } = testData;
        const test = await client_1.prisma.standardizedTest.create({
            data: {
                athleteId: req.userId,
                testDate: new Date(testDate),
                ...restData
            }
        });
        res.json({
            success: true,
            test,
            message: "Standardized test stored successfully"
        });
    }
    catch (err) {
        if (err?.issues) {
            return res.status(400).json({ message: "Validation failed", errors: err.issues });
        }
        res.status(500).json({ message: "Failed to store standardized test", error: err });
    }
});
router.post("/tests/psychological", (0, middleware_1.auth)("athlete"), async (req, res) => {
    try {
        const assessmentData = psychologicalAssessmentSchema.parse(req.body);
        const { assessmentDate, ...restData } = assessmentData;
        const assessment = await client_1.prisma.psychologicalAssessment.create({
            data: {
                athleteId: req.userId,
                assessmentDate: new Date(assessmentDate),
                ...restData
            }
        });
        res.json({
            success: true,
            assessment,
            message: "Psychological assessment stored successfully"
        });
    }
    catch (err) {
        if (err?.issues) {
            return res.status(400).json({ message: "Validation failed", errors: err.issues });
        }
        res.status(500).json({ message: "Failed to store psychological assessment", error: err });
    }
});
router.post("/tests/sport", (0, middleware_1.auth)("athlete"), async (req, res) => {
    try {
        const testData = sportTestSchema.parse(req.body);
        const athlete = await client_1.prisma.athlete.findUnique({
            where: { id: req.userId },
            select: { sport: true }
        });
        if (!athlete) {
            return res.status(404).json({ message: "Athlete not found" });
        }
        const modelName = `${athlete.sport.charAt(0) + athlete.sport.slice(1).toLowerCase()}Test`;
        const test = await client_1.prisma[modelName].create({
            data: {
                athleteId: req.userId,
                testDate: new Date(testData.testDate),
                testResults: testData.testResults
            }
        });
        res.json({
            success: true,
            test,
            message: "Sport-specific test stored successfully"
        });
    }
    catch (err) {
        if (err?.issues) {
            return res.status(400).json({ message: "Validation failed", errors: err.issues });
        }
        res.status(500).json({ message: "Failed to store sport test", error: err });
    }
});
router.get("/tests/history", (0, middleware_1.auth)("athlete"), async (req, res) => {
    try {
        const athlete = await client_1.prisma.athlete.findUnique({
            where: { id: req.userId },
            include: {
                standardizedTests: {
                    orderBy: { testDate: 'desc' }
                },
                psychologicalAssessments: {
                    orderBy: { assessmentDate: 'desc' }
                }
            }
        });
        if (!athlete) {
            return res.status(404).json({ message: "Athlete not found" });
        }
        const sportModelName = `${athlete.sport.charAt(0) + athlete.sport.slice(1).toLowerCase()}Test`;
        const sportTests = await client_1.prisma[sportModelName].findMany({
            where: { athleteId: req.userId },
            orderBy: { testDate: 'desc' }
        });
        res.json({
            success: true,
            athlete: {
                id: athlete.id,
                firstName: athlete.firstName,
                lastName: athlete.lastName,
                sport: athlete.sport,
                email: athlete.email,
                age: athlete.age,
                gender: athlete.gender
            },
            testHistory: {
                standardized: {
                    count: athlete.standardizedTests?.length || 0,
                    latest: athlete.standardizedTests?.[0] || null,
                    all: athlete.standardizedTests || []
                },
                psychological: {
                    count: athlete.psychologicalAssessments?.length || 0,
                    latest: athlete.psychologicalAssessments?.[0] || null,
                    all: athlete.psychologicalAssessments || []
                },
                sportSpecific: {
                    count: sportTests.length,
                    latest: sportTests[0] || null,
                    all: sportTests
                }
            },
            summary: {
                totalTests: (athlete.standardizedTests?.length || 0) + (athlete.psychologicalAssessments?.length || 0) + sportTests.length,
                lastTestDate: Math.max(athlete.standardizedTests?.[0]?.testDate?.getTime() || 0, athlete.psychologicalAssessments?.[0]?.assessmentDate?.getTime() || 0, sportTests[0]?.testDate?.getTime() || 0)
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch test history", error: err });
    }
});
router.get("/leaderboard", (0, middleware_1.auth)("athlete"), async (req, res) => {
    try {
        const athlete = await client_1.prisma.athlete.findUnique({
            where: { id: req.userId },
            select: { sport: true }
        });
        if (!athlete) {
            return res.status(404).json({ message: "Athlete not found" });
        }
        const leaderboard = await leaderboard_1.LeaderboardService.getSportLeaderboard(athlete.sport);
        res.json({
            success: true,
            sport: athlete.sport,
            leaderboard,
            message: `Leaderboard for ${athlete.sport} athletes`
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch leaderboard", error: err });
    }
});
router.get("/feedback", (0, middleware_1.auth)("athlete"), async (req, res) => {
    try {
        const report = await aiFeedback_1.AIFeedbackService.generateAthleteReport(req.userId);
        res.json({
            success: true,
            report,
            message: "AI feedback report generated successfully"
        });
    }
    catch (err) {
        if (err.message === 'Athlete not found') {
            return res.status(404).json({ message: "Athlete not found" });
        }
        res.status(500).json({ message: "Failed to generate AI feedback report", error: err });
    }
});
exports.default = router;
