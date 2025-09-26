'use server';
/**
 * @fileOverview Summarizes terms and conditions using GenAI.
 *
 * - summarizeTermsAndConditions - A function that summarizes terms and conditions.
 * - SummarizeTermsAndConditionsInput - The input type for the summarizeTermsAndConditions function.
 * - SummarizeTermsAndConditionsOutput - The return type for the summarizeTermsAndConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTermsAndConditionsInputSchema = z.object({
  termsAndConditions: z
    .string()
    .describe('The terms and conditions text to summarize.'),
});
export type SummarizeTermsAndConditionsInput = z.infer<
  typeof SummarizeTermsAndConditionsInputSchema
>;

const SummarizeTermsAndConditionsOutputSchema = z.object({
  summary: z.string().describe('The summarized terms and conditions.'),
});
export type SummarizeTermsAndConditionsOutput = z.infer<
  typeof SummarizeTermsAndConditionsOutputSchema
>;

export async function summarizeTermsAndConditions(
  input: SummarizeTermsAndConditionsInput
): Promise<SummarizeTermsAndConditionsOutput> {
  return summarizeTermsAndConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTermsAndConditionsPrompt',
  input: {schema: SummarizeTermsAndConditionsInputSchema},
  output: {schema: SummarizeTermsAndConditionsOutputSchema},
  prompt: `Summarize the following terms and conditions in a concise and easy-to-understand manner:\n\n{{{termsAndConditions}}}`,
});

const summarizeTermsAndConditionsFlow = ai.defineFlow(
  {
    name: 'summarizeTermsAndConditionsFlow',
    inputSchema: SummarizeTermsAndConditionsInputSchema,
    outputSchema: SummarizeTermsAndConditionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
