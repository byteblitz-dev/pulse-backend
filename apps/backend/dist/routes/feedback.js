"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("@repo/auth/passport"));
const genai_1 = require("../services/genai");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const feedbackSchema = zod_1.z.object({
    performanceData: zod_1.z.any()
});
// Send data to GenAI wrapper and return response (works for both athletes and officials)
router.post("/", async (req, res, next) => {
    try {
        const { performanceData } = feedbackSchema.parse(req.body);
        // Try to authenticate as athlete first
        passport_1.default.authenticate("athlete-jwt", { session: false }, async (err, athlete) => {
            if (athlete) {
                // User is an athlete
                const feedback = await (0, genai_1.getGenaiFeedback)(performanceData, { perspective: "athlete" });
                return res.json({ feedback });
            }
            // If not athlete, try to authenticate as official
            passport_1.default.authenticate("official-jwt", { session: false }, async (err, official) => {
                if (official) {
                    // User is an official
                    const feedback = await (0, genai_1.getGenaiFeedback)(performanceData, { perspective: "official" });
                    return res.json({ feedback });
                }
                // Neither athlete nor official - unauthorized
                return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
            })(req, res, next);
        })(req, res, next);
    }
    catch (err) {
        if (err?.issues) {
            return res.status(400).json({ message: "Validation failed", errors: err.issues });
        }
        res.status(500).json({ message: "Failed to get feedback", error: err });
    }
});
exports.default = router;
