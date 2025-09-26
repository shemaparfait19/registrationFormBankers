'use server';

import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { FormState } from './schema';
import { revalidatePath } from 'next/cache';

export async function saveToDb(formData: FormState) {
  try {
    const docRef = await addDoc(collection(db, "registrations"), {
      ...formData,
      passportExpiryDate: formData.passportExpiryDate ? formData.passportExpiryDate.toISOString().split('T')[0] : null,
      submittedAt: serverTimestamp()
    });
    console.log("Document written with ID: ", docRef.id);
    revalidatePath('/dashboard');
    return { success: true, docId: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: "Failed to save data." };
  }
}

export async function getRegistrations() {
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        const registrations = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore Timestamp to a serializable format (string)
                submittedAt: data.submittedAt?.toDate().toISOString() || null,
            };
        });
        return { success: true, data: registrations };
    } catch (e) {
        console.error("Error getting documents: ", e);
        return { success: false, error: "Failed to fetch registrations." };
    }
}

export async function updateRegistration(id: string, formData: Partial<FormState>) {
    try {
        const docRef = doc(db, "registrations", id);
        await updateDoc(docRef, {
            ...formData,
            passportExpiryDate: formData.passportExpiryDate ? new Date(formData.passportExpiryDate).toISOString().split('T')[0] : null,
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch (e) {
        console.error("Error updating document: ", e);
        return { success: false, error: "Failed to update registration." };
    }
}

export async function deleteRegistration(id: string) {
    try {
        await deleteDoc(doc(db, "registrations", id));
        revalidatePath('/dashboard');
        return { success: true };
    } catch (e) {
        console.error("Error deleting document: ", e);
        return { success: false, error: "Failed to delete registration." };
    }
}
