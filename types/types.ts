export interface Creator {
    creatorId: any;
    username: string;
    country: string
    niches: string[];
    followers: number;
    engagementRate: number;
    avgWatchTime: number;
    contentStyle: string;
    primaryHookType: string;
    brandSafetyFlags: string[];
    totalScore: number;
    scoreBreakdown: {
        nicheMatch: number;
        audienceCountryMatch: number;
        engagementWeight: number;
        hookMatch: number;
        brandSafetyPenalty: number;
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