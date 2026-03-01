import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trcp";
import { BriefOutput } from "@/utils/brief-validation";
import { generateBriefWithAI } from "@/services/ai-brief-service";

export const briefRouter = createTRPCRouter({
  generateBrief: publicProcedure
    .input(z.object({ campaignId: z.string(), creatorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { data: cached } = await ctx.db
        .from("campaign_briefs")
        .select("brief_content")
        .match({ campaign_id: input.campaignId, creator_id: input.creatorId })
        .single();

      if (cached) return cached.brief_content as BriefOutput;
      const [{ data: campaign }, { data: creator }] = await Promise.all([
        ctx.db.from("campaigns").select("*").eq("id", input.campaignId).single(),
        ctx.db.from("creators").select("*").eq("id", input.creatorId).single(),
      ]);

      if (!campaign || !creator) throw new TRPCError({ code: "NOT_FOUND" });

      const finalBrief = await generateBriefWithAI({ campaign, creator });

      await ctx.db.from("campaign_briefs").insert({
        campaign_id: input.campaignId,
        creator_id: input.creatorId,
        brief_content: finalBrief,
      });

      return finalBrief;
    }),
});