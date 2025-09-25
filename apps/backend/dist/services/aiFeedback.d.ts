type Sport = "ARCHERY" | "ATHLETICS" | "BOXING" | "CYCLING" | "FENCING" | "HOCKEY" | "JUDO" | "ROWING" | "SWIMMING" | "SHOOTING" | "TABLE_TENNIS" | "WEIGHTLIFTING" | "WRESTLING";
export interface AIFeedbackReport {
    athleteId: string;
    athleteName: string;
    sport: Sport;
    reportDate: string;
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    performanceTrends: {
        standardized: 'improving' | 'declining' | 'stable';
        psychological: 'improving' | 'declining' | 'stable';
        sportSpecific: 'improving' | 'declining' | 'stable';
    };
    detailedAnalysis: {
        standardized: {
            score: number;
            analysis: string;
            keyMetrics: any;
        };
        psychological: {
            score: number;
            analysis: string;
            keyMetrics: any;
        };
        sportSpecific: {
            score: number;
            analysis: string;
            keyMetrics: any;
        };
    };
    nextSteps: string[];
    motivationalMessage: string;
}
export declare class AIFeedbackService {
    static generateAthleteReport(athleteId: string): Promise<AIFeedbackReport>;
    private static getLatestStandardizedTest;
    private static getLatestPsychologicalAssessment;
    private static getLatestSportSpecificTest;
    private static getHistoricalStandardizedTests;
    private static getHistoricalPsychologicalAssessments;
    private static getHistoricalSportSpecificTests;
    private static calculateStandardizedScore;
    private static calculatePsychologicalScore;
    private static calculateSportSpecificScore;
    private static analyzeTrend;
    private static identifyStrengths;
    private static identifyWeaknesses;
    private static generateRecommendations;
    private static generateNextSteps;
    private static generateMotivationalMessage;
    private static generateStandardizedAnalysis;
    private static generatePsychologicalAnalysis;
    private static generateSportSpecificAnalysis;
    private static extractKeyMetrics;
}
export {};
//# sourceMappingURL=aiFeedback.d.ts.map