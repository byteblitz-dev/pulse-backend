import { prisma } from "@repo/db/client";

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

export class LeaderboardService {
  static async getSportLeaderboard(sport: Sport): Promise<LeaderboardCategory[]> {
    try {
      const athletes = await prisma.athlete.findMany({
        where: { sport } as any,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          sport: true
        } as any
      });

      if (athletes.length === 0) {
        return [];
      }

      const athleteIds = athletes.map(a => a.id);

      const standardizedTests = await (prisma as any).standardizedTest.findMany({
        where: { athleteId: { in: athleteIds } },
        select: {
          athleteId: true,
          height: true,
          weight: true,
          sitAndReach: true,
          standingVerticalJump: true,
          standingBroadJump: true,
          medicineBallThrow: true,
          sprint30m: true,
          shuttleRun4x10m: true,
          situps: true,
          run800m: true,
          run1600m: true,
          testDate: true
        },
        orderBy: { testDate: 'desc' }
      });

      const psychologicalAssessments = await (prisma as any).psychologicalAssessment.findMany({
        where: { athleteId: { in: athleteIds } },
        select: {
          athleteId: true,
          mentalToughness: true,
          competitiveAnxiety: true,
          teamCohesion: true,
          mentalHealth: true,
          personalityTraits: true,
          motivationGoals: true,
          stressCoping: true,
          healthScreening: true,
          imageryAbility: true,
          reactionTime: true,
          determination: true,
          timeAnticipation: true,
          peripheralVision: true,
          attentionAlertness: true,
          sensorimotorTasks: true,
          balanceTests: true,
          psychomotorTasks: true,
          cognitiveTasks: true,
          performanceConsistency: true,
          assessmentDate: true
        },
        orderBy: { assessmentDate: 'desc' }
      });

      const sportModelName = `${sport.charAt(0) + sport.slice(1).toLowerCase()}Test`;
      const sportTests = await (prisma as any)[sportModelName].findMany({
        where: { athleteId: { in: athleteIds } },
        select: {
          athleteId: true,
          testResults: true,
          testDate: true
        },
        orderBy: { testDate: 'desc' }
      });

      const athleteScores = new Map<string, {
        standardizedScore: number;
        psychologicalScore: number;
        sportSpecificScore: number;
        totalTests: number;
      }>();

      standardizedTests.forEach((test: any) => {
        const score = this.calculateStandardizedScore(test);
        const existing = athleteScores.get(test.athleteId) || {
          standardizedScore: 0,
          psychologicalScore: 0,
          sportSpecificScore: 0,
          totalTests: 0
        };
        existing.standardizedScore = Math.max(existing.standardizedScore, score);
        existing.totalTests++;
        athleteScores.set(test.athleteId, existing);
      });

      psychologicalAssessments.forEach((assessment: any) => {
        const score = this.calculatePsychologicalScore(assessment);
        const existing = athleteScores.get(assessment.athleteId) || {
          standardizedScore: 0,
          psychologicalScore: 0,
          sportSpecificScore: 0,
          totalTests: 0
        };
        existing.psychologicalScore = Math.max(existing.psychologicalScore, score);
        existing.totalTests++;
        athleteScores.set(assessment.athleteId, existing);
      });

      sportTests.forEach((test: any) => {
        const score = this.calculateSportSpecificScore(test.testResults);
        const existing = athleteScores.get(test.athleteId) || {
          standardizedScore: 0,
          psychologicalScore: 0,
          sportSpecificScore: 0,
          totalTests: 0
        };
        existing.sportSpecificScore = Math.max(existing.sportSpecificScore, score);
        existing.totalTests++;
        athleteScores.set(test.athleteId, existing);
      });

      const entries: LeaderboardEntry[] = athletes.map((athlete: any) => {
        const scores = athleteScores.get(athlete.id) || {
          standardizedScore: 0,
          psychologicalScore: 0,
          sportSpecificScore: 0,
          totalTests: 0
        };
        
        const overallScore = (scores.standardizedScore + scores.psychologicalScore + scores.sportSpecificScore) / 3;
        
        return {
          athleteId: athlete.id,
          firstName: athlete.firstName,
          lastName: athlete.lastName,
          sport: athlete.sport,
          standardizedScore: scores.standardizedScore,
          psychologicalScore: scores.psychologicalScore,
          sportSpecificScore: scores.sportSpecificScore,
          overallScore,
          rank: 0,
          totalTests: scores.totalTests
        };
      });

      const standardizedEntries = [...entries]
        .sort((a, b) => b.standardizedScore - a.standardizedScore)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      const psychologicalEntries = [...entries]
        .sort((a, b) => b.psychologicalScore - a.psychologicalScore)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      const sportSpecificEntries = [...entries]
        .sort((a, b) => b.sportSpecificScore - a.sportSpecificScore)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      const overallEntries = [...entries]
        .sort((a, b) => b.overallScore - a.overallScore)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      return [
        { category: 'standardized', entries: standardizedEntries },
        { category: 'psychological', entries: psychologicalEntries },
        { category: 'sportSpecific', entries: sportSpecificEntries },
        { category: 'overall', entries: overallEntries }
      ];

    } catch (error) {
      console.error('Error generating leaderboard:', error);
      throw new Error('Failed to generate leaderboard');
    }
  }

 
  private static calculateStandardizedScore(test: any): number {
    let score = 0;
    let factors = 0;

    if (test.height && test.weight) {
      const bmi = test.weight / Math.pow(test.height / 100, 2);
      const bmiScore = Math.max(0, 100 - Math.abs(bmi - 21.7) * 10);
      score += bmiScore;
      factors++;
    }

    if (test.sitAndReach && typeof test.sitAndReach === 'object' && test.sitAndReach.value) {
      const flexibilityScore = Math.min(100, (test.sitAndReach.value / 30) * 100);
      score += flexibilityScore;
      factors++;
    }

    if (test.standingVerticalJump && typeof test.standingVerticalJump === 'object' && test.standingVerticalJump.value) {
      const powerScore = Math.min(100, (test.standingVerticalJump.value / 60) * 100);
      score += powerScore;
      factors++;
    }

    if (test.sprint30m && typeof test.sprint30m === 'object' && test.sprint30m.value) {
      const speedScore = Math.max(0, 100 - (test.sprint30m.value - 3.5) * 20);
      score += speedScore;
      factors++;
    }

    if (test.situps && typeof test.situps === 'object' && test.situps.count) {
      const enduranceScore = Math.min(100, (test.situps.count / 50) * 100);
      score += enduranceScore;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  
  private static calculatePsychologicalScore(assessment: any): number {
    let score = 0;
    let factors = 0;

    if (assessment.mentalToughness && typeof assessment.mentalToughness === 'object' && assessment.mentalToughness.score) {
      score += assessment.mentalToughness.score;
      factors++;
    }

    if (assessment.competitiveAnxiety && typeof assessment.competitiveAnxiety === 'object' && assessment.competitiveAnxiety.level) {
      const anxietyScore = Math.max(0, 100 - assessment.competitiveAnxiety.level * 10);
      score += anxietyScore;
      factors++;
    }

    if (assessment.teamCohesion && typeof assessment.teamCohesion === 'object' && assessment.teamCohesion.score) {
      score += assessment.teamCohesion.score;
      factors++;
    }

    if (assessment.reactionTime && typeof assessment.reactionTime === 'object' && assessment.reactionTime.average) {
      const reactionScore = Math.max(0, 100 - (assessment.reactionTime.average - 200) * 0.5);
      score += reactionScore;
      factors++;
    }

    if (assessment.determination && typeof assessment.determination === 'object' && assessment.determination.score) {
      score += assessment.determination.score;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  
  private static calculateSportSpecificScore(testResults: any): number {
    if (!testResults || typeof testResults !== 'object') {
      return 0;
    }

    let score = 0;
    let factors = 0;

    const metrics = ['score', 'accuracy', 'speed', 'power', 'endurance', 'technique', 'efficiency'];
    
    metrics.forEach(metric => {
      if (testResults[metric] && typeof testResults[metric] === 'number') {
        score += Math.min(100, testResults[metric]);
        factors++;
      } else if (testResults[metric] && typeof testResults[metric] === 'object' && testResults[metric].value) {
        score += Math.min(100, testResults[metric].value);
        factors++;
      }
    });

    return factors > 0 ? score / factors : 0;
  }
}