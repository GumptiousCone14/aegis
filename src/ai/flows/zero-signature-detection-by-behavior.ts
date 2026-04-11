'use server';
/**
 * @fileOverview An AI agent that identifies never-before-seen malware through behavioral pattern analysis.
 *
 * - analyzeBehavioralDNA - A function that analyzes process fingerprints and API call sequences to detect malware.
 * - AnalyzeBehavioralDNAInput - The input type for the analyzeBehavioralDNA function.
 * - AnalyzeBehavioralDNAOutput - The return type for the analyzeBehavioralDNA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBehavioralDNAInputSchema = z.object({
  processFingerprint: z
    .string()
    .describe(
      'A detailed fingerprint of the process, including API call sequences and resource access patterns.'
    ),
});
export type AnalyzeBehavioralDNAInput = z.infer<typeof AnalyzeBehavioralDNAInputSchema>;

const AnalyzeBehavioralDNAOutputSchema = z.object({
  isMalicious: z.boolean().describe('Whether the process is identified as malicious.'),
  threatLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('The assessed threat level of the identified malware.'),
  explanation: z
    .string()
    .describe('A detailed explanation of why the process is considered malicious.'),
});
export type AnalyzeBehavioralDNAOutput = z.infer<typeof AnalyzeBehavioralDNAOutputSchema>;

export async function analyzeBehavioralDNA(
  input: AnalyzeBehavioralDNAInput
): Promise<AnalyzeBehavioralDNAOutput> {
  return analyzeBehavioralDNAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBehavioralDNAPrompt',
  input: {schema: AnalyzeBehavioralDNAInputSchema},
  output: {schema: AnalyzeBehavioralDNAOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in zero-day malware detection.

You will analyze the provided process fingerprint to determine if it exhibits malicious behavior.

Consider the API call sequences, resource access patterns, and any other relevant indicators to assess the threat level and provide a detailed explanation.

Process Fingerprint: {{{processFingerprint}}}`,
});

const analyzeBehavioralDNAFlow = ai.defineFlow(
  {
    name: 'analyzeBehavioralDNAFlow',
    inputSchema: AnalyzeBehavioralDNAInputSchema,
    outputSchema: AnalyzeBehavioralDNAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
