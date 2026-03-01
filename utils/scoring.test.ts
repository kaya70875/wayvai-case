import { describe, it, expect } from 'vitest';
import { calculateScore } from './scoring';

describe('Influencer Scoring Algorithm', () => {
  const mockCampaign = {
    niches: ['comedy', 'tech'],
    targetCountry: 'US',
    minAvgWatchTime: 30,
    preferredHookTypes: ['Humor'],
  };

  it('should give a perfect score (85) for a perfect match without penalties', () => {
    const perfectCreator = {
      niches: ['comedy'], // +30
      audience: { topCountries: ['US'] }, // +20
      engagementRate: 0.06, // +15
      avgWatchTime: 45, // +10
      primaryHookType: 'Humor', // +10
      brandSafetyFlags: [],
    };

    const result = calculateScore({ campaign: mockCampaign, creator: perfectCreator });
    expect(result.totalScore).toBe(85);
  });

  it('should apply -10 penalty for brand safety flags', () => {
    const riskyCreator = {
      niches: ['comedy'], // +30
      audience: { topCountries: ['US'] }, // +20
      engagementRate: 0.06, // +15
      avgWatchTime: 45, // +10
      primaryHookType: 'Humor', // +10
      brandSafetyFlags: ['profanity'], // -10
    };

    const result = calculateScore({ campaign: mockCampaign, creator: riskyCreator });
    expect(result.totalScore).toBe(75);
  });

  it('should return 0 if there are no matches at all', () => {
    const badCreator = {
      niches: ['fitness'],
      audience: { topCountries: ['TR'] },
      engagementRate: 0.01,
      avgWatchTime: 5,
      primaryHookType: 'Tutorial',
      brandSafetyFlags: [],
    };

    const result = calculateScore({ campaign: mockCampaign, creator: badCreator });
    expect(result.totalScore).toBe(0);
  });
});