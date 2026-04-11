import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-attack-attribution.ts';
import '@/ai/flows/zero-signature-detection-by-behavior.ts';
import '@/ai/flows/generate-firewall-rules.ts';
import '@/ai/flows/automated-threat-response-suggestions.ts';