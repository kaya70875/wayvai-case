import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../api/trpc";

export const matchingRouter = createTRPCRouter({
  getTopCreators: publicProcedure
    .input(z.object({ campaignId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { data: campaign } = await ctx.db
        .from("campaigns")
        .select("*")
        .eq("id", input.campaignId)
        .single();

      const { data: creators } = await ctx.db.from("creators").select("*");

      if (!campaign || !creators) throw new Error("Veri bulunamadı");

      const rankedCreators = creators.map((creator) => {
        let scoreBreakdown = {
          nicheMatch: 0,
          audienceCountryMatch: 0,
          engagementWeight: 0,
          hookMatch: 0,
          brandSafetyPenalty: 0,
        };

        // --- Niche Match (30 Points) ---
        const commonNiches = creator.niches.filter((n: string) => 
          campaign.niches.includes(n)
        );
        scoreBreakdown.nicheMatch = commonNiches.length > 0 ? 30 : 0;

        // --- Country Match (20 Points) ---
        const isCountryMatch = creator.audience?.topCountries?.includes(campaign.targetCountry);
        scoreBreakdown.audienceCountryMatch = isCountryMatch ? 20 : 0;

        // --- Engagement & Stats (25 Points) ---
        if (creator.engagementRate > 0.05) scoreBreakdown.engagementWeight += 15;
        if (creator.avgWatchTime >= campaign.minAvgWatchTime) scoreBreakdown.engagementWeight += 10;

        // --- Hook Match (10 Points) ---
        const isHookPreferred = campaign.preferredHookTypes.includes(creator.primaryHookType);
        scoreBreakdown.hookMatch = isHookPreferred ? 10 : 0;

        // --- Brand Safety (Ceza) ---
        if (creator.brandSafetyFlags?.length > 0) {
          scoreBreakdown.brandSafetyPenalty = -10;
        }

        const totalScore = Object.values(scoreBreakdown).reduce((a, b) => a + b, 0);

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