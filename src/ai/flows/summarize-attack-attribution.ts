'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing attack attribution.
 *
 * - summarizeAttackAttribution - An asynchronous function that takes attack details as input and returns a summarized attribution report.
 * - SummarizeAttackAttributionInput - The input type for the summarizeAttackAttribution function.
 * - SummarizeAttackAttributionOutput - The return type for the summarizeAttackAttribution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAttackAttributionInputSchema = z.object({
  attackDetails: z
    .string()
    .describe(
      'Detailed information about the attack, including logs, affected systems, and observed behaviors.'
    ),
});
export type SummarizeAttackAttributionInput = z.infer<typeof SummarizeAttackAttributionInputSchema>;

const SummarizeAttackAttributionOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the attack attribution, including the likely threat actor, their motives, and the confidence level of the attribution.'
    ),
  threatActor: z.string().describe('The likely threat actor behind the attack.'),
  motives: z.string().describe('The likely motives of the threat actor.'),
  confidenceLevel: z
    .string()
    .describe(
      'The confidence level (e.g., high, medium, low) of the attack attribution.'
    ),
});
export type SummarizeAttackAttributionOutput = z.infer<typeof SummarizeAttackAttributionOutputSchema>;

export async function summarizeAttackAttribution(
  input: SummarizeAttackAttributionInput
): Promise<SummarizeAttackAttributionOutput> {
  return summarizeAttackAttributionFlow(input);
}

const summarizeAttackAttributionPrompt = ai.definePrompt({
  name: 'summarizeAttackAttributionPrompt',
  input: {schema: SummarizeAttackAttributionInputSchema},
  output: {schema: SummarizeAttackAttributionOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in attack attribution.

  Given the following attack details, provide a concise summary of the attack attribution, including the likely threat actor, their motives, and the confidence level of the attribution.

  Attack Details: {{{attackDetails}}}

  Respond in the following format:
  {
    "summary": "A concise summary of the attack attribution.",
    "threatActor": "The likely threat actor behind the attack.",
    "motives": "The likely motives of the threat actor.",
    "confidenceLevel": "The confidence level (e.g., high, medium, low) of the attack attribution."
  }`,
});

const summarizeAttackAttributionFlow = ai.defineFlow(
  {
    name: 'summarizeAttackAttributionFlow',
    inputSchema: SummarizeAttackAttributionInputSchema,
    outputSchema: SummarizeAttackAttributionOutputSchema,
  },
  async input => {
    const {output} = await summarizeAttackAttributionPrompt(input);
    return output!;
  }
);
