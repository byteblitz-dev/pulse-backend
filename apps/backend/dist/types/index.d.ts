import { Request } from "express";
export interface CustomRequest extends Request {
    userId?: string;
    userRole?: string;
}
export declare enum Sport {
    ARCHERY = "ARCHERY",
    ATHLETICS = "ATHLETICS",
    BOXING = "BOXING",
    CYCLING = "CYCLING",
    FENCING = "FENCING",
    HOCKEY = "HOCKEY",
    JUDO = "JUDO",
    ROWING = "ROWING",
    SWIMMING = "SWIMMING",
    SHOOTING = "SHOOTING",
    TABLE_TENNIS = "TABLE_TENNIS",
    WEIGHTLIFTING = "WEIGHTLIFTING",
    WRESTLING = "WRESTLING"
}
export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}
export interface StandardizedTestData {
    height: number;
    weight: number;
    sitAndReach: any;
    standingVerticalJump: any;
    standingBroadJump: any;
    medicineBallThrow: any;
    sprint30m: any;
    shuttleRun4x10m: any;
    situps: any;
    run800m?: any;
    run1600m?: any;
}
export interface PsychologicalAssessmentData {
    mentalToughness: any;
    competitiveAnxiety: any;
    teamCohesion: any;
    mentalHealth: any;
    personalityTraits: any;
    motivationGoals: any;
    stressCoping: any;
    healthScreening: any;
    imageryAbility: any;
    reactionTime: any;
    determination: any;
    timeAnticipation: any;
    peripheralVision: any;
    attentionAlertness: any;
    sensorimotorTasks: any;
    balanceTests: any;
    psychomotorTasks: any;
    cognitiveTasks: any;
    performanceConsistency: any;
}
export interface SportTestData {
    testResults: any;
}
//# sourceMappingURL=index.d.ts.map