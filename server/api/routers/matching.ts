import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trcp";
import { calculateScore } from "@/utils/scoring";

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
        const {totalScore, breakdown: scoreBreakdown} = calculateScore({campaign, creator})

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