export interface Creator {
    creatorId: any;
    username: string;
    totalScore: number;
    niches: string[];
    audience: {
        topCountries: string[];
    }
}

export interface TopCreator {
    creatorId: any;
    username: string;
    totalScore: number;
    scoreBreakdown: {
        nicheMatch: number;
        countryMatch: number;
        engagement: number;
        hookMatch: number;
        safetyPenalty: number;
    };
}

export interface Campaign {
    id: any;
    brand: string;
    objective: string;
    targetCountry: string;
    targetGender: string;
    targetAgeRange: string;
    niches: string[];
    preferredHookTypes: string[];
    minAvgWatchTime: number;
    budgetRange: number;
    tone: string;
    doNotUseWords: string[];
}