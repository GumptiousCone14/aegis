// This file implements the Genkit flow for generating AI-driven suggestions for threat response.

'use server';

/**
 * @fileOverview Generates AI-driven suggestions for threat response.
 *
 * - automatedThreatResponseSuggestions - A function that generates threat response suggestions.
 * - AutomatedThreatResponseSuggestionsInput - The input type for the automatedThreatResponseSuggestions function.
 * - AutomatedThreatResponseSuggestionsOutput - The return type for the automatedThreatResponseSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatedThreatResponseSuggestionsInputSchema = z.object({
  threatDescription: z.string().describe('A detailed description of the detected threat, including its type, affected systems, and potential impact.'),
  securityPolicies: z.string().describe('A summary of the organization\'s existing security policies and procedures.'),
  systemConfiguration: z.string().describe('Information about the current system configuration, including installed software, network settings, and user permissions.'),
});
export type AutomatedThreatResponseSuggestionsInput = z.infer<typeof AutomatedThreatResponseSuggestionsInputSchema>;

const AutomatedThreatResponseSuggestionsOutputSchema = z.object({
  suggestedResponses: z.array(z.string()).describe('A list of AI-driven suggestions for responding to the detected threat, ranked by effectiveness and feasibility.'),
  rationale: z.string().describe('A detailed explanation of the rationale behind each suggested response, including its potential benefits and risks.'),
  confidenceScore: z.number().describe('A confidence score indicating the AI\'s certainty in the effectiveness of the suggested responses (0-1).'),
});
export type AutomatedThreatResponseSuggestionsOutput = z.infer<typeof AutomatedThreatResponseSuggestionsOutputSchema>;

export async function automatedThreatResponseSuggestions(input: AutomatedThreatResponseSuggestionsInput): Promise<AutomatedThreatResponseSuggestionsOutput> {
  return automatedThreatResponseSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedThreatResponseSuggestionsPrompt',
  input: {schema: AutomatedThreatResponseSuggestionsInputSchema},
  output: {schema: AutomatedThreatResponseSuggestionsOutputSchema},
  prompt: `You are an AI-powered security expert providing suggestions for threat response.

  Based on the provided threat description, security policies, and system configuration, generate a list of suggested responses, a rationale for each, and a confidence score.

  Threat Description: {{{threatDescription}}}
  Security Policies: {{{securityPolicies}}}
  System Configuration: {{{systemConfiguration}}}

  Format the output as a JSON object conforming to the following schema:
  ${JSON.stringify(AutomatedThreatResponseSuggestionsOutputSchema.describe(''))}`,
});

const automatedThreatResponseSuggestionsFlow = ai.defineFlow(
  {
    name: 'automatedThreatResponseSuggestionsFlow',
    inputSchema: AutomatedThreatResponseSuggestionsInputSchema,
    outputSchema: AutomatedThreatResponseSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
