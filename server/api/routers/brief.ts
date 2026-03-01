import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trcp";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com",
});

const BriefOutputSchema = z.object({
  outreachMessage: z.string(),
  contentIdeas: z.array(z.string()).length(5),
  hooks: z.array(z.string()).length(3),
});

type BriefOutput = z.infer<typeof BriefOutputSchema>;

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

      const generateWithAI = async (isRetry = false): Promise<BriefOutput> => {
        const response = await openai.chat.completions.create({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: `Return ONLY valid JSON matching:
              outreachMessage: string
              contentIdeas: array of 5 strings
              hooks: array of 3 strings
              Tone: ${campaign.tone}
              Forbidden words: ${campaign.doNotUseWords.join(", ")}`
            },
            {
              role: "user",
              content: `
              Brand: ${campaign.brand}
              Creator: @${creator.username}
              Niche: ${creator.niche}
              Audience: ${creator.audience_description}
              Goal: ${campaign.goal}
              Keep concise.
              `
          }
          ],
          response_format: { type: "json_object" },
          max_tokens: 500,
          temperature: 0.7
        });

        const rawContent = response.choices[0]?.message?.content;
        if (!rawContent) {
          throw new Error('No content from model.');
        }
        
        try {
          return BriefOutputSchema.parse(JSON.parse(rawContent));
        } catch (err) {
          if (!isRetry) {
            console.log("Malformed JSON, retrying...");
            return generateWithAI(true);
          }
          throw new TRPCError({ 
            code: "INTERNAL_SERVER_ERROR", 
            message: "AI failed to produce valid JSON after retry." 
          });
        }
      };

      const finalBrief = await generateWithAI();

      await ctx.db.from("campaign_briefs").insert({
        campaign_id: input.campaignId,
        creator_id: input.creatorId,
        brief_content: finalBrief,
      });

      return finalBrief;
    }),
});