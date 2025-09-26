'use server';

import { summarizeTermsAndConditions as summarize } from '@/ai/flows/summarize-terms-and-conditions';
import { numberToWords } from '@/ai/flows/number-to-words';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { FormState } from './schema';

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

export async function convertNumberToWords(amount: number) {
  try {
    const result = await numberToWords({ number: amount });
    return { success: true, words: result.words };
  } catch (error) {
    console.error('AI Number Conversion Error:', error);
    return { success: false, error: 'An unexpected error occurred during conversion.' };
  }
}

export async function saveToDb(formData: FormState) {
  try {
    const docRef = await addDoc(collection(db, "registrations"), {
      ...formData,
      passportExpiryDate: formData.passportExpiryDate ? formData.passportExpiryDate.toISOString().split('T')[0] : null,
      submittedAt: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
    return { success: true, docId: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: "Failed to save data." };
  }
}
