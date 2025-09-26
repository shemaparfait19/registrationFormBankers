'use server';
/**
 * @fileOverview Converts a number into its word representation using GenAI.
 *
 * - numberToWords - A function that converts a number to words.
 * - NumberToWordsInput - The input type for the numberToWords function.
 * - NumberToWordsOutput - The return type for the numberToWords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NumberToWordsInputSchema = z.object({
  number: z.number().describe('The number to convert to words.'),
});
export type NumberToWordsInput = z.infer<typeof NumberToWordsInputSchema>;

const NumberToWordsOutputSchema = z.object({
  words: z.string().describe('The word representation of the number, in title case. For example, "One Hundred Twenty-Three".'),
});
export type NumberToWordsOutput = z.infer<typeof NumberToWordsOutputSchema>;

export async function numberToWords(
  input: NumberToWordsInput
): Promise<NumberToWordsOutput> {
  return numberToWordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'numberToWordsPrompt',
  input: {schema: NumberToWordsInputSchema},
  output: {schema: NumberToWordsOutputSchema},
  prompt: `Convert the following number to its English word representation, ensuring the output is in title case. For example, 15000 should be "Fifteen Thousand". Number: {{{number}}}`,
});

const numberToWordsFlow = ai.defineFlow(
  {
    name: 'numberToWordsFlow',
    inputSchema: NumberToWordsInputSchema,
    outputSchema: NumberToWordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
