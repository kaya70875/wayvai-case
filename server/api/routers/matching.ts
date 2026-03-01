import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trcp";

export const matchingRouter = createTRPCRouter({
getTopCreators: publicProcedure
    .input(z.object({ campaignId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { data: campaign, error: campaignError } = await ctx.db
        .from("campaigns")
        .select(`
          niches,
          targetCountry,
          minAvgWatchTime,
          preferredHookTypes
        `)
        .eq("id", input.campaignId)
        .single();

      if (campaignError || !campaign) throw new Error("Campaign not found");

      const { data: creators, error: creatorsError } = await ctx.db
        .from("creators")
        .select(`
          id,
          username,
          niches,
          audience,
          engagementRate,
          avgWatchTime,
          primaryHookType,
          brandSafetyFlags
        `);

      if (creatorsError || !creators)
        throw new Error("Creators not found");

      const rankedCreators = creators.map((creator) => {
        let scoreBreakdown = {
          nicheMatch: 0,
          audienceCountryMatch: 0,
          engagementWeight: 0,
          hookMatch: 0,
          brandSafetyPenalty: 0,
        };

        const commonNiches = creator.niches.filter((n: string) =>
          campaign.niches.includes(n)
        );
        scoreBreakdown.nicheMatch = commonNiches.length > 0 ? 30 : 0;

        const isCountryMatch =
          creator.audience?.topCountries?.includes(campaign.targetCountry);
        scoreBreakdown.audienceCountryMatch = isCountryMatch ? 20 : 0;

        if (creator.engagementRate > 0.05)
          scoreBreakdown.engagementWeight += 15;

        if (creator.avgWatchTime >= campaign.minAvgWatchTime)
          scoreBreakdown.engagementWeight += 10;

        const isHookPreferred =
          campaign.preferredHookTypes.includes(creator.primaryHookType);
        scoreBreakdown.hookMatch = isHookPreferred ? 10 : 0;

        if (creator.brandSafetyFlags?.length > 0) {
          scoreBreakdown.brandSafetyPenalty = -10;
        }

        const totalScore = Object.values(scoreBreakdown).reduce(
          (a, b) => a + b,
          0
        );

        return {
          creatorId: creator.id,
          username: creator.username,
          totalScore,
          scoreBreakdown,
        };
      });

      return rankedCreators
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 20);
    }),
    
  getAllCampaigns: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.db.from("campaigns").select("id, brand, objective");
    if (error) throw error;
    return data;
  }),
});