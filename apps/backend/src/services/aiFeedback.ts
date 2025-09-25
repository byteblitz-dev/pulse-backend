import { prisma } from "@repo/db/client";

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

export class AIFeedbackService {
  static async generateAthleteReport(athleteId: string): Promise<AIFeedbackReport> {
    try {
      const athlete = await prisma.athlete.findUnique({
        where: { id: athleteId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          sport: true,
          age: true,
          gender: true
        } as any
      });

      if (!athlete) {
        throw new Error('Athlete not found');
      }

      const [latestStandardized, latestPsychological, latestSportSpecific] = await Promise.all([
        this.getLatestStandardizedTest(athleteId),
        this.getLatestPsychologicalAssessment(athleteId),
        this.getLatestSportSpecificTest(athleteId, (athlete as any).sport)
      ]);

      const [historicalStandardized, historicalPsychological, historicalSportSpecific] = await Promise.all([
        this.getHistoricalStandardizedTests(athleteId),
        this.getHistoricalPsychologicalAssessments(athleteId),
        this.getHistoricalSportSpecificTests(athleteId, (athlete as any).sport)
      ]);

      const standardizedScore = this.calculateStandardizedScore(latestStandardized);
      const psychologicalScore = this.calculatePsychologicalScore(latestPsychological);
      const sportSpecificScore = this.calculateSportSpecificScore(latestSportSpecific);
      const overallScore = (standardizedScore + psychologicalScore + sportSpecificScore) / 3;

      const performanceTrends = {
        standardized: this.analyzeTrend(historicalStandardized),
        psychological: this.analyzeTrend(historicalPsychological),
        sportSpecific: this.analyzeTrend(historicalSportSpecific)
      };

      const strengths = this.identifyStrengths(standardizedScore, psychologicalScore, sportSpecificScore, (athlete as any).sport);
      const weaknesses = this.identifyWeaknesses(standardizedScore, psychologicalScore, sportSpecificScore, (athlete as any).sport);
      const recommendations = this.generateRecommendations(weaknesses, performanceTrends, (athlete as any).sport);
      const nextSteps = this.generateNextSteps(recommendations, (athlete as any).sport);
      const motivationalMessage = this.generateMotivationalMessage(overallScore, performanceTrends, (athlete as any).sport);

      return {
        athleteId: (athlete as any).id,
        athleteName: `${(athlete as any).firstName} ${(athlete as any).lastName}`,
        sport: (athlete as any).sport,
        reportDate: new Date().toISOString(),
        overallScore: Math.round(overallScore),
        strengths,
        weaknesses,
        recommendations,
        performanceTrends,
        detailedAnalysis: {
          standardized: {
            score: Math.round(standardizedScore),
            analysis: this.generateStandardizedAnalysis(latestStandardized, performanceTrends.standardized),
            keyMetrics: this.extractKeyMetrics(latestStandardized)
          },
          psychological: {
            score: Math.round(psychologicalScore),
            analysis: this.generatePsychologicalAnalysis(latestPsychological, performanceTrends.psychological),
            keyMetrics: this.extractKeyMetrics(latestPsychological)
          },
          sportSpecific: {
            score: Math.round(sportSpecificScore),
            analysis: this.generateSportSpecificAnalysis(latestSportSpecific, performanceTrends.sportSpecific, (athlete as any).sport),
            keyMetrics: this.extractKeyMetrics(latestSportSpecific)
          }
        },
        nextSteps,
        motivationalMessage
      };

    } catch (error) {
      console.error('Error generating AI feedback report:', error);
      throw new Error('Failed to generate AI feedback report');
    }
  }

  
  private static async getLatestStandardizedTest(athleteId: string) {
    return await (prisma as any).standardizedTest.findFirst({
      where: { athleteId },
      orderBy: { testDate: 'desc' }
    });
  }

  
  private static async getLatestPsychologicalAssessment(athleteId: string) {
    return await (prisma as any).psychologicalAssessment.findFirst({
      where: { athleteId },
      orderBy: { assessmentDate: 'desc' }
    });
  }

  
  private static async getLatestSportSpecificTest(athleteId: string, sport: Sport) {
    const modelName = `${sport.charAt(0) + sport.slice(1).toLowerCase()}Test`;
    return await (prisma as any)[modelName].findFirst({
      where: { athleteId },
      orderBy: { testDate: 'desc' }
    });
  }

  private static async getHistoricalStandardizedTests(athleteId: string) {
    return await (prisma as any).standardizedTest.findMany({
      where: { athleteId },
      orderBy: { testDate: 'desc' },
      take: 5
    });
  }

  
  private static async getHistoricalPsychologicalAssessments(athleteId: string) {
    return await (prisma as any).psychologicalAssessment.findMany({
      where: { athleteId },
      orderBy: { assessmentDate: 'desc' },
      take: 5
    });
  }

 
  private static async getHistoricalSportSpecificTests(athleteId: string, sport: Sport) {
    const modelName = `${sport.charAt(0) + sport.slice(1).toLowerCase()}Test`;
    return await (prisma as any)[modelName].findMany({
      where: { athleteId },
      orderBy: { testDate: 'desc' },
      take: 5
    });
  }

  
  private static calculateStandardizedScore(test: any): number {
    if (!test) return 0;
    
    let score = 0;
    let factors = 0;

    if (test.height && test.weight) {
      const bmi = test.weight / Math.pow(test.height / 100, 2);
      const bmiScore = Math.max(0, 100 - Math.abs(bmi - 21.7) * 10);
      score += bmiScore;
      factors++;
    }

    const metrics = ['sitAndReach', 'standingVerticalJump', 'standingBroadJump', 'medicineBallThrow', 'sprint30m', 'shuttleRun4x10m', 'situps'];
    metrics.forEach(metric => {
      if (test[metric]) {
        score += 70;
        factors++;
      }
    });

    return factors > 0 ? score / factors : 0;
  }

  
  private static calculatePsychologicalScore(assessment: any): number {
    if (!assessment) return 0;
    
    let score = 0;
    let factors = 0;

    const metrics = ['mentalToughness', 'competitiveAnxiety', 'teamCohesion', 'mentalHealth', 'personalityTraits', 'motivationGoals', 'stressCoping', 'healthScreening', 'imageryAbility', 'reactionTime', 'determination', 'timeAnticipation', 'peripheralVision', 'attentionAlertness', 'sensorimotorTasks', 'balanceTests', 'psychomotorTasks', 'cognitiveTasks', 'performanceConsistency'];
    
    metrics.forEach(metric => {
      if (assessment[metric]) {
        score += 70;
        factors++;
      }
    });

    return factors > 0 ? score / factors : 0;
  }

  
  private static calculateSportSpecificScore(test: any): number {
    if (!test || !test.testResults) return 0;
    
    return 75;
  }

  
  private static analyzeTrend(historicalData: any[]): 'improving' | 'declining' | 'stable' {
    if (historicalData.length < 2) return 'stable';
    
    const recent = historicalData[0];
    const previous = historicalData[1];
    
    return 'stable';
  }

  
  private static identifyStrengths(standardized: number, psychological: number, sportSpecific: number, sport: Sport): string[] {
    const strengths: string[] = [];
    
    if (standardized >= 80) strengths.push('Excellent physical fitness and standardized test performance');
    if (psychological >= 80) strengths.push('Strong mental resilience and psychological readiness');
    if (sportSpecific >= 80) strengths.push(`Outstanding ${sport.toLowerCase()} specific skills and performance`);
    
    if (standardized >= 70 && standardized < 80) strengths.push('Good physical conditioning');
    if (psychological >= 70 && psychological < 80) strengths.push('Solid mental preparation');
    if (sportSpecific >= 70 && sportSpecific < 80) strengths.push(`Competent ${sport.toLowerCase()} performance`);
    
    return strengths.length > 0 ? strengths : ['Consistent effort and dedication'];
  }

 
  private static identifyWeaknesses(standardized: number, psychological: number, sportSpecific: number, sport: Sport): string[] {
    const weaknesses: string[] = [];
    
    if (standardized < 60) weaknesses.push('Physical fitness needs improvement');
    if (psychological < 60) weaknesses.push('Mental preparation requires attention');
    if (sportSpecific < 60) weaknesses.push(`${sport} specific skills need development`);
    
    if (standardized >= 60 && standardized < 70) weaknesses.push('Physical conditioning has room for improvement');
    if (psychological >= 60 && psychological < 70) weaknesses.push('Mental resilience could be stronger');
    if (sportSpecific >= 60 && sportSpecific < 70) weaknesses.push(`${sport} performance can be enhanced`);
    
    return weaknesses.length > 0 ? weaknesses : ['Continue current training approach'];
  }

  
  private static generateRecommendations(weaknesses: string[], trends: any, sport: Sport): string[] {
    const recommendations: string[] = [];
    
    weaknesses.forEach(weakness => {
      if (weakness.includes('Physical')) {
        recommendations.push('Increase cardiovascular training and strength conditioning');
        recommendations.push('Focus on flexibility and mobility exercises');
      }
      if (weakness.includes('Mental')) {
        recommendations.push('Practice visualization and mental rehearsal techniques');
        recommendations.push('Work with sports psychologist for mental training');
      }
      if (weakness.includes(sport)) {
        recommendations.push(`Increase ${sport.toLowerCase()} specific training sessions`);
        recommendations.push('Analyze technique with specialized coaches');
      }
    });
    
    return recommendations.length > 0 ? recommendations : ['Maintain current training regimen'];
  }

  
  private static generateNextSteps(recommendations: string[], sport: Sport): string[] {
    const nextSteps: string[] = [
      'Schedule follow-up assessment in 4-6 weeks',
      'Implement recommended training modifications',
      'Track progress with regular testing'
    ];
    
    if (recommendations.some(r => r.includes('Mental'))) {
      nextSteps.push('Book consultation with sports psychologist');
    }
    
    if (recommendations.some(r => r.includes('Physical'))) {
      nextSteps.push('Update training program with fitness coach');
    }
    
    return nextSteps;
  }

  
  private static generateMotivationalMessage(overallScore: number, trends: any, sport: Sport): string {
    if (overallScore >= 85) {
      return `Outstanding performance! You're demonstrating elite-level capabilities in ${sport.toLowerCase()}. Keep pushing your limits!`;
    } else if (overallScore >= 70) {
      return `Great work! You're showing strong performance across all areas. Focus on the small improvements to reach the next level.`;
    } else if (overallScore >= 55) {
      return `Good foundation! You have solid potential in ${sport.toLowerCase()}. With focused training, you can achieve significant improvements.`;
    } else {
      return `Every champion starts somewhere. Your dedication to improvement in ${sport.toLowerCase()} will pay off. Stay committed to your training!`;
    }
  }

 
  private static generateStandardizedAnalysis(test: any, trend: string): string {
    if (!test) return 'No standardized test data available.';
    
    return `Physical fitness assessment shows ${trend} performance. Key areas include cardiovascular endurance, strength, and flexibility. Focus on maintaining consistency in training.`;
  }

  private static generatePsychologicalAnalysis(assessment: any, trend: string): string {
    if (!assessment) return 'No psychological assessment data available.';
    
    return `Mental preparation shows ${trend} development. Psychological readiness is crucial for competitive performance. Continue mental training exercises.`;
  }

  private static generateSportSpecificAnalysis(test: any, trend: string, sport: Sport): string {
    if (!test) return `No ${sport.toLowerCase()} specific test data available.`;
    
    return `${sport} specific performance shows ${trend} results. Sport-specific skills are essential for competitive success. Focus on technique refinement.`;
  }


  private static extractKeyMetrics(test: any): any {
    if (!test) return {};
    
    const metrics: any = {};
    
    if (test.height) metrics.height = test.height;
    if (test.weight) metrics.weight = test.weight;
    if (test.testResults) metrics.testResults = test.testResults;
    
    return metrics;
  }
}