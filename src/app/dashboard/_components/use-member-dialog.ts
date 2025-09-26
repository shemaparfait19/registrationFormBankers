'use client';

import { create } from 'zustand';
import type { FormState } from '@/lib/schema';

type Registration = FormState & { id: string, submittedAt: string };

interface MemberDialogStore {
  isOpen: boolean;
  member: Registration | null;
  onOpen: (member: Registration) => void;
  onClose: () => void;
}

export const useMemberDialog = create<MemberDialogStore>((set) => ({
  isOpen: false,
  member: null,
  onOpen: (member) => set({ isOpen: true, member }),
  onClose: () => set({ isOpen: false, member: null }),
}));

// A provider is used to ensure this is only used on the client
import { createContext, useContext } from 'react';
export const MemberDialogContext = createContext(true);
export const MemberDialogProvider = ({ children }: { children: React.ReactNode }) => (
    <MemberDialogContext.Provider value={true}>
        {children}
    </MemberDialogContext.Provider>
);
