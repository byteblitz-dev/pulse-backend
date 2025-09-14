"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@repo/db/client");
const middleware_1 = require("@repo/auth/middleware");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// ---------- Zod Schemas ----------
// For storing test result
const storeResultSchema = zod_1.z.object({
    testType: zod_1.z.string().min(1, "Test type is required"),
    metrics: zod_1.z.any()
});
// For official fetching a specific athlete's results
const athleteIdParamSchema = zod_1.z.object({
    athleteId: zod_1.z.string().cuid("Invalid athleteId")
});
// ---------- Routes ----------
// Athlete: Store test result from on-device ML
router.post("/store", (0, middleware_1.auth)("athlete"), async (req, res) => {
    try {
        const { testType, metrics } = storeResultSchema.parse(req.body);
        const result = await client_1.prisma.testResult.create({
            data: {
                session: {
                    create: { athleteId: req.userId }
                },
                testType,
                metrics
            },
            include: { session: true }
        });
        res.json({ success: true, result });
    }
    catch (err) {
        if (err?.issues) {
            return res.status(400).json({ message: "Validation failed", errors: err.issues });
        }
        res.status(500).json({ message: "Failed to store result", error: err });
    }
});
// Athlete: View own results
router.get("/my-results", (0, middleware_1.auth)("athlete"), async (req, res) => {
    try {
        const results = await client_1.prisma.testResult.findMany({
            where: { session: { athleteId: req.userId } },
            include: { session: true },
            orderBy: { createdAt: "desc" }
        });
        res.json({ success: true, results });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch results", error: err });
    }
});
// Official: View all athletes' results
router.get("/all", (0, middleware_1.auth)("official"), async (_req, res) => {
    try {
        const results = await client_1.prisma.testResult.findMany({
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
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch all results", error: err });
    }
});
// Official: View results for a specific athlete
router.get("/athlete/:athleteId", (0, middleware_1.auth)("official"), async (req, res) => {
    try {
        const { athleteId } = athleteIdParamSchema.parse(req.params);
        const results = await client_1.prisma.testResult.findMany({
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
    }
    catch (err) {
        if (err?.issues) {
            return res.status(400).json({ message: "Validation failed", errors: err.issues });
        }
        res.status(500).json({ message: "Failed to fetch athlete results", error: err });
    }
});
exports.default = router;
