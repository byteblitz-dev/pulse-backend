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
const officialSignupSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, "First name is required"),
    lastName: zod_1.z.string().min(1, "Last name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().min(1, "Phone number is required"),
    gender: zod_1.z.nativeEnum(types_1.Gender, "Invalid gender"),
    sport: zod_1.z.nativeEnum(types_1.Sport, "Invalid sport"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters")
});
const officialSigninSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required")
});
const athleteIdParamSchema = zod_1.z.object({
    athleteId: zod_1.z.string().cuid("Invalid athleteId")
});
router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, phone, gender, sport, password } = officialSignupSchema.parse(req.body);
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const official = await client_1.prisma.official.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                gender,
                sport,
                passwordHash
            }
        });
        res.json({
            success: true,
            official: {
                id: official.id,
                firstName: official.firstName,
                lastName: official.lastName,
                email: official.email,
                sport: official.sport
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
        res.status(500).json({ message: "Official signup failed", error: err });
    }
});
router.post("/signin", (req, res, next) => {
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
        res.json({
            success: true,
            token,
            message: "Signin successful"
        });
    })(req, res, next);
});
router.get("/athletes", (0, middleware_1.auth)("official"), async (req, res) => {
    try {
        const official = await client_1.prisma.official.findUnique({
            where: { id: req.userId },
            select: { sport: true }
        });
        if (!official) {
            return res.status(404).json({ message: "Official not found" });
        }
        const athletes = await client_1.prisma.athlete.findMany({
            where: { sport: official.sport },
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
            }
        });
        res.json({
            success: true,
            athletes,
            sport: official.sport,
            count: athletes.length,
            message: `Found ${athletes.length} athletes in ${official.sport}`
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch athletes", error: err });
    }
});
router.get("/athletes/tests", (0, middleware_1.auth)("official"), async (req, res) => {
    try {
        const official = await client_1.prisma.official.findUnique({
            where: { id: req.userId },
            select: { sport: true }
        });
        if (!official) {
            return res.status(404).json({ message: "Official not found" });
        }
        const athletes = await client_1.prisma.athlete.findMany({
            where: { sport: official.sport },
            include: {
                standardizedTests: {
                    orderBy: { testDate: 'desc' }
                },
                psychologicalAssessments: {
                    orderBy: { assessmentDate: 'desc' }
                }
            }
        });
        const sportModelName = `${official.sport?.charAt(0) + official.sport?.slice(1).toLowerCase()}Test`;
        const sportTests = await client_1.prisma[sportModelName].findMany({
            where: {
                athlete: { sport: official.sport }
            },
            include: {
                athlete: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        sport: true
                    }
                }
            },
            orderBy: { testDate: 'desc' }
        });
        res.json({
            success: true,
            sport: official.sport,
            athletes: athletes.map(athlete => ({
                id: athlete.id,
                firstName: athlete.firstName,
                lastName: athlete.lastName,
                email: athlete.email,
                age: athlete.age,
                gender: athlete.gender,
                sport: athlete.sport,
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
                        count: sportTests.filter((test) => test.athleteId === athlete.id).length,
                        latest: sportTests.find((test) => test.athleteId === athlete.id) || null,
                        all: sportTests.filter((test) => test.athleteId === athlete.id)
                    }
                },
                summary: {
                    totalTests: (athlete.standardizedTests?.length || 0) + (athlete.psychologicalAssessments?.length || 0) + sportTests.filter((test) => test.athleteId === athlete.id).length,
                    lastTestDate: Math.max(athlete.standardizedTests?.[0]?.testDate?.getTime() || 0, athlete.psychologicalAssessments?.[0]?.assessmentDate?.getTime() || 0, sportTests.find((test) => test.athleteId === athlete.id)?.testDate?.getTime() || 0)
                }
            })),
            sportTests,
            message: `Test results for all ${official.sport} athletes`
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch all test results", error: err });
    }
});
router.get("/athletes/:athleteId/tests", (0, middleware_1.auth)("official"), async (req, res) => {
    try {
        const { athleteId } = athleteIdParamSchema.parse(req.params);
        const official = await client_1.prisma.official.findUnique({
            where: { id: req.userId },
            select: { sport: true }
        });
        if (!official) {
            return res.status(404).json({ message: "Official not found" });
        }
        const athlete = await client_1.prisma.athlete.findUnique({
            where: { id: athleteId },
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
        if (athlete.sport !== official.sport) {
            return res.status(403).json({ message: "Access denied: Athlete is not in your sport" });
        }
        const sportModelName = `${athlete.sport.charAt(0) + athlete.sport.slice(1).toLowerCase()}Test`;
        const sportTests = await client_1.prisma[sportModelName].findMany({
            where: { athleteId },
            orderBy: { testDate: 'desc' }
        });
        res.json({
            success: true,
            athlete: {
                id: athlete.id,
                firstName: athlete.firstName,
                lastName: athlete.lastName,
                email: athlete.email,
                age: athlete.age,
                gender: athlete.gender,
                sport: athlete.sport
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
            },
            message: `Test history for ${athlete.firstName} ${athlete.lastName}`
        });
    }
    catch (err) {
        if (err?.issues) {
            return res.status(400).json({ message: "Validation failed", errors: err.issues });
        }
        res.status(500).json({ message: "Failed to fetch athlete test history", error: err });
    }
});
router.get("/leaderboard", (0, middleware_1.auth)("official"), async (req, res) => {
    try {
        const official = await client_1.prisma.official.findUnique({
            where: { id: req.userId },
            select: { sport: true }
        });
        if (!official) {
            return res.status(404).json({ message: "Official not found" });
        }
        const leaderboard = await leaderboard_1.LeaderboardService.getSportLeaderboard(official.sport);
        res.json({
            success: true,
            sport: official.sport,
            leaderboard,
            message: `Leaderboard for ${official.sport} athletes`
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch leaderboard", error: err });
    }
});
router.get("/athletes/:athleteId/feedback", (0, middleware_1.auth)("official"), async (req, res) => {
    try {
        const { athleteId } = athleteIdParamSchema.parse(req.params);
        const official = await client_1.prisma.official.findUnique({
            where: { id: req.userId },
            select: { sport: true }
        });
        if (!official) {
            return res.status(404).json({ message: "Official not found" });
        }
        const athlete = await client_1.prisma.athlete.findUnique({
            where: { id: athleteId },
            select: { id: true, sport: true, firstName: true, lastName: true }
        });
        if (!athlete) {
            return res.status(404).json({ message: "Athlete not found" });
        }
        if (athlete.sport !== official.sport) {
            return res.status(403).json({ message: "Access denied: Athlete is not in your sport" });
        }
        const report = await aiFeedback_1.AIFeedbackService.generateAthleteReport(athleteId);
        res.json({
            success: true,
            report,
            message: `AI feedback report generated for ${athlete.firstName} ${athlete.lastName}`
        });
    }
    catch (err) {
        if (err.message === 'Athlete not found') {
            return res.status(404).json({ message: "Athlete not found" });
        }
        if (err?.issues) {
            return res.status(400).json({ message: "Validation failed", errors: err.issues });
        }
        res.status(500).json({ message: "Failed to generate AI feedback report", error: err });
    }
});
router.get("/athletes/feedback", (0, middleware_1.auth)("official"), async (req, res) => {
    try {
        const official = await client_1.prisma.official.findUnique({
            where: { id: req.userId },
            select: { sport: true }
        });
        if (!official) {
            return res.status(404).json({ message: "Official not found" });
        }
        const athletes = await client_1.prisma.athlete.findMany({
            where: { sport: official.sport },
            select: { id: true, firstName: true, lastName: true }
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
        const reports = await Promise.all(athletesToProcess.map(async (athlete) => {
            try {
                const report = await aiFeedback_1.AIFeedbackService.generateAthleteReport(athlete.id);
                return report;
            }
            catch (error) {
                console.error(`Failed to generate report for athlete ${athlete.id}:`, error);
                return null;
            }
        }));
        const successfulReports = reports.filter(report => report !== null);
        res.json({
            success: true,
            reports: successfulReports,
            totalAthletes: athletes.length,
            processedAthletes: successfulReports.length,
            message: `AI feedback reports generated for ${successfulReports.length} athletes in ${official.sport}`
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to generate AI feedback reports", error: err });
    }
});
exports.default = router;
