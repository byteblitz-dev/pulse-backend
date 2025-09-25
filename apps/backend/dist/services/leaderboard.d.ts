type Sport = "ARCHERY" | "ATHLETICS" | "BOXING" | "CYCLING" | "FENCING" | "HOCKEY" | "JUDO" | "ROWING" | "SWIMMING" | "SHOOTING" | "TABLE_TENNIS" | "WEIGHTLIFTING" | "WRESTLING";
export interface LeaderboardEntry {
    athleteId: string;
    firstName: string;
    lastName: string;
    sport: Sport;
    standardizedScore: number;
    psychologicalScore: number;
    sportSpecificScore: number;
    overallScore: number;
    rank: number;
    totalTests: number;
}
export interface LeaderboardCategory {
    category: 'standardized' | 'psychological' | 'sportSpecific' | 'overall';
    entries: LeaderboardEntry[];
}
export declare class LeaderboardService {
    static getSportLeaderboard(sport: Sport): Promise<LeaderboardCategory[]>;
    private static calculateStandardizedScore;
    private static calculatePsychologicalScore;
    private static calculateSportSpecificScore;
}
export {};
//# sourceMappingURL=leaderboard.d.ts.map