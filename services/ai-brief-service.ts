import OpenAI from "openai";
import { TRPCError } from "@trpc/server";
import { BriefOutput, validateAIResponse } from "@/utils/brief-validation";
import { Campaign, Creator } from "@/types/types";

const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY!,
    baseURL: "https://api.deepseek.com",
});

interface GenerateBriefParams {
    campaign: Campaign;
    creator: Creator;
}

export async function generateBriefWithAI(
    params: GenerateBriefParams,
    isRetry = false
): Promise<BriefOutput> {
    const { campaign, creator } = params;

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
              Niche: ${creator.niches}
              Audience: ${creator.country}
              Keep concise.
              `
            }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
        temperature: 0.7
    });

    const rawContent = response.choices[0]?.message?.content;
    if (!rawContent) throw new Error('AI returned no content');

    try {
        return validateAIResponse(rawContent);
    } catch (err) {
        if (!isRetry) {
            console.log("Malformed JSON, retrying AI generation...");
            return generateBriefWithAI(params, true);
        }
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "AI validation failed after multiple attempts."
        });
    }
}