import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trcp";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY, 
});

export const briefRouter = createTRPCRouter({
  generateBrief: publicProcedure
    .input(z.object({ campaignId: z.string(), creatorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { data: existingBrief } = await ctx.db
        .from("campaign_briefs")
        .select("brief_content")
        .eq("campaign_id", input.campaignId)
        .eq("creator_id", input.creatorId)
        .single();

      if (existingBrief) return { brief: existingBrief.brief_content };

      const { data: campaign } = await ctx.db.from("campaigns").select("*").eq("id", input.campaignId).single();
      const { data: creator } = await ctx.db.from("creators").select("*").eq("id", input.creatorId).single();

      if (!campaign || !creator) throw new Error("Couldn't found necessary fields.");

      const prompt = `
        You are a professional Influencer Marketing specialist. 
        Campaign: ${campaign.brand} - Target: ${campaign.objective}.
        Influencer: @${creator.username} - Niche: ${creator.niches.join(", ")}.
        
        Write a collaboration brief for this influencer that is sincere, attention-grabbing, and matches the "${campaign.tone}" tone of the campaign.
        Hook type to be used: ${creator.primaryHookType}.
        Please do not use these words: ${campaign.doNotUseWords.join(", ")}.
      `;

      const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      });

      const generatedBrief = response.choices[0]?.message?.content || "";

      await ctx.db.from("campaign_briefs").insert({
        campaign_id: input.campaignId,
        creator_id: input.creatorId,
        brief_content: generatedBrief
      });

      return { brief: generatedBrief };
    }),
});