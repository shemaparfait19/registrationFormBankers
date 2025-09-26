'use server';

import { summarizeTermsAndConditions as summarize } from '@/ai/flows/summarize-terms-and-conditions';

export async function summarizeTerms(terms: string) {
  if (!terms) {
    return { success: false, error: 'No terms provided to summarize.' };
  }
  try {
    const result = await summarize({ termsAndConditions: terms });
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error('AI Summarization Error:', error);
    return { success: false, error: 'An unexpected error occurred while summarizing the terms.' };
  }
}
