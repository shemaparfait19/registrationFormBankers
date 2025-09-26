import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Wand2, Loader2, FileText } from 'lucide-react';
import { useState } from 'react';
import { summarizeTerms } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type StepProps = {
  onPrev: () => void;
};

const termsAndConditionsText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Section 2: Contributions. Each member shall contribute a monthly amount as agreed. Failure to contribute for three consecutive months may result in suspension of membership benefits. Section 3: Withdrawals. Members may request to withdraw their contributions subject to a 30-day notice period and a 5% processing fee. Section 4: Governance. The fund is governed by a board of directors elected by the members. All decisions are made in the best interest of the fund and its members.`;

export default function AgreementStep({ onPrev }: StepProps) {
  const form = useFormContext();
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const result = await summarizeTerms(termsAndConditionsText);
    setIsSummarizing(false);
    if (result.success && result.summary) {
      setSummary(result.summary);
      setShowSummaryDialog(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: result.error || 'Could not summarize the terms.',
      });
    }
  };
  
  const watchedFullName = form.watch("fullName");

  return (
    <>
    <Card className="w-full step-card">
      <CardHeader>
        <CardTitle>Terms & Agreement</CardTitle>
        <CardDescription>Please review and agree to the terms to complete your application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-medium">Terms Review</h3>
          <div className="w-full p-4 border rounded-lg">
             <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Read Full Terms and Conditions</AccordionTrigger>
                  <AccordionContent className="h-48 overflow-y-auto pr-2 text-muted-foreground">
                    {termsAndConditionsText}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleSummarize} disabled={isSummarizing} type="button">
              {isSummarizing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Summarize with AI
            </Button>
            <Button variant="outline" type="button">
                <FileText className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
          </div>
        </div>

        <div className="space-y-4">
            <h3 className="font-medium">Digital Signature</h3>
            <p className="text-sm text-muted-foreground">
                Please type your full name in the box below to digitally sign this agreement. Your typed name will serve as your legally binding signature.
            </p>
             <FormField
                control={form.control}
                name="signature"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Signature (Type your full name)</FormLabel>
                    <FormControl>
                        <Input 
                            placeholder={watchedFullName || "Your Full Name"} 
                            {...field}
                            className="font-serif text-2xl h-16 tracking-wider"
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Final Consent</h3>
           <FormField control={form.control} name="acceptTerms" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none"><FormLabel>I accept the terms and conditions.</FormLabel><FormMessage /></div>
              </FormItem>
            )} />
            <FormField control={form.control} name="consentToSharing" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none"><FormLabel>I consent to my information being shared for verification purposes.</FormLabel><FormMessage /></div>
              </FormItem>
            )} />
            <FormField control={form.control} name="confirmAccuracy" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none"><FormLabel>I confirm all information provided is accurate and truthful.</FormLabel><FormMessage /></div>
              </FormItem>
            )} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev} type="button">Back</Button>
        <Button size="lg" type="submit">Submit Application</Button>
      </CardFooter>
    </Card>

    <AlertDialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>AI-Powered Summary</AlertDialogTitle>
            <AlertDialogDescription>
                Here is a summary of the terms and conditions. Note: This is for convenience only. The full terms and conditions are legally binding.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="max-h-60 overflow-y-auto text-sm text-muted-foreground pr-2">
                {summary}
            </div>
            <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowSummaryDialog(false)}>Got it</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
