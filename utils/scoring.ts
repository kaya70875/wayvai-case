export interface ScoringInput {
  campaign: {
    niches: string[];
    targetCountry: string;
    minAvgWatchTime: number;
    preferredHookTypes: string[];
  };
  creator: {
    niches: string[];
    audience: { topCountries: string[] };
    engagementRate: number;
    avgWatchTime: number;
    primaryHookType: string;
    brandSafetyFlags: string[];
  };
}

export function calculateScore(input: ScoringInput) {
  const { campaign, creator } = input;
  let score = 0;
  const breakdown = {
    nicheMatch: 0,
    countryMatch: 0,
    engagement: 0,
    hookMatch: 0,
    safetyPenalty: 0,
  };

  // 1. Niche Match (30pt)
  const hasNicheMatch = creator.niches.some(n => campaign.niches.includes(n));
  if (hasNicheMatch) {
    breakdown.nicheMatch = 30;
    score += 30;
  }

  // 2. Country Match (20pt)
  const isCountryMatch = creator.audience.topCountries.includes(campaign.targetCountry);
  if (isCountryMatch) {
    breakdown.countryMatch = 20;
    score += 20;
  }

  // 3. Engagement (25pt)
  if (creator.engagementRate >= 0.05) {
    breakdown.engagement += 15;
    score += 15;
  }
  if (creator.avgWatchTime >= campaign.minAvgWatchTime) {
    breakdown.engagement += 10;
    score += 10;
  }

  // 4. Hook Match (10pt)
  if (campaign.preferredHookTypes.includes(creator.primaryHookType)) {
    breakdown.hookMatch = 10;
    score += 10;
  }

  // 5. Safety Penalty (-10pt)
  if (creator.brandSafetyFlags.length > 0) {
    breakdown.safetyPenalty = -10;
    score -= 10;
  }

  return { totalScore: Math.max(0, score), breakdown };
}