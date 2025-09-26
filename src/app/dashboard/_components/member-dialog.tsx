'use client';

import { useMemberDialog } from './use-member-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, type FormState } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import PersonalDetailsStep from '@/components/steps/personal-details-step';
import InvestmentStep from '@/components/steps/investment-step';
import AgreementStep from '@/components/steps/agreement-step';
import { useEffect } from 'react';
import { updateRegistration } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


export const MemberDialog = () => {
  const { isOpen, onClose, member } = useMemberDialog();
  const { toast } = useToast();

  const methods = useForm<FormState>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    if (member) {
      const memberData = {
        ...member,
        passportExpiryDate: member.passportExpiryDate ? new Date(member.passportExpiryDate) : undefined,
      };
      reset(memberData);
    }
  }, [member, reset]);

  const processUpdate = async (data: FormState) => {
    if (!member) return;

    const result = await updateRegistration(member.id, data);

    if (result.success) {
      toast({ title: "Success", description: "Member details updated." });
      onClose();
    } else {
      toast({ variant: 'destructive', title: "Update Failed", description: result.error });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Member Details: {member?.fullName}</DialogTitle>
          <DialogDescription>
            View or edit the member's registration information. Click "Save Changes" when you're done.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(processUpdate)}>
            <ScrollArea className="h-[60vh] p-4">
              <div className="space-y-8">
                 {/* The components from steps are re-used here. They don't have navigation. */}
                <PersonalDetailsStep onNext={() => {}} onPrev={() => {}} />
                <InvestmentStep onNext={() => {}} onPrev={() => {}} />
                <AgreementStep onPrev={() => {}} />
              </div>
            </ScrollArea>
             <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
