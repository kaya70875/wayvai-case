import { z } from "zod";

export const BriefOutputSchema = z.object({
  outreachMessage: z.string().min(10),
  contentIdeas: z.array(z.string()).length(5),
  hooks: z.array(z.string()).length(3),
});

export type BriefOutput = z.infer<typeof BriefOutputSchema>;

export function validateAIResponse(rawJson: string): BriefOutput {
  try {
    const parsed = JSON.parse(rawJson);
    return BriefOutputSchema.parse(parsed);
  } catch (error) {
    throw new Error("Invalid AI Response Format");
  }
}