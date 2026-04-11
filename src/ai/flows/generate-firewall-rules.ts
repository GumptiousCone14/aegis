'use server';

/**
 * @fileOverview A flow that automatically generates firewall rules based on identified C2 beaconing and data exfiltration attempts.
 *
 * - generateFirewallRules - A function that generates firewall rules.
 * - GenerateFirewallRulesInput - The input type for the generateFirewallRules function.
 * - GenerateFirewallRulesOutput - The return type for the generateFirewallRules function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFirewallRulesInputSchema = z.object({
  networkTrafficData: z
    .string()
    .describe(
      'Network traffic data including potential C2 beaconing and data exfiltration attempts.'
    ),
});
export type GenerateFirewallRulesInput = z.infer<typeof GenerateFirewallRulesInputSchema>;

const GenerateFirewallRulesOutputSchema = z.object({
  firewallRules: z
    .string()
    .describe(
      'Firewall rules generated to block identified C2 beaconing and data exfiltration attempts.'
    ),
  explanation: z
    .string()
    .describe(
      'Explanation of the generated firewall rules and the threats they are designed to mitigate.'
    ),
});
export type GenerateFirewallRulesOutput = z.infer<typeof GenerateFirewallRulesOutputSchema>;

export async function generateFirewallRules(
  input: GenerateFirewallRulesInput
): Promise<GenerateFirewallRulesOutput> {
  return generateFirewallRulesFlow(input);
}

const generateFirewallRulesPrompt = ai.definePrompt({
  name: 'generateFirewallRulesPrompt',
  input: {schema: GenerateFirewallRulesInputSchema},
  output: {schema: GenerateFirewallRulesOutputSchema},
  prompt: `You are an expert network security engineer.

  Based on the provided network traffic data, generate firewall rules to block identified C2 beaconing and data exfiltration attempts.

  Also, provide a clear explanation of each rule and the threat it mitigates.

  Network Traffic Data: {{{networkTrafficData}}}

  Format the firewall rules in a way that is compatible with common firewall systems like iptables or pf.
  `,
});

const generateFirewallRulesFlow = ai.defineFlow(
  {
    name: 'generateFirewallRulesFlow',
    inputSchema: GenerateFirewallRulesInputSchema,
    outputSchema: GenerateFirewallRulesOutputSchema,
  },
  async input => {
    const {output} = await generateFirewallRulesPrompt(input);
    return output!;
  }
);
