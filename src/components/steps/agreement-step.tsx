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
import jsPDF from 'jspdf';

type StepProps = {
  onPrev: () => void;
};

const termsAndConditionsText = `
Classification: Public

TERMS AND CONDITIONS OF INVESTING IN THE FUND
1)Membership: Current and former bankers in and out of the country are eligible to join.
2)Share Value: 1share equals to15,000Rwf.
i)A member is mandated to contribute not less than one share per month.
ii)A member is free to top up his/her shares/savings with any amount within a month.
3)Management fee: A member is mandated to pay 3,000Rwf while joining. This can be deducted from the shares honored or paid
separately.
4)LOAN:
i) Amount open to loan: 80% of the savings.
ii)Loan Interest rate: 3% for the amount open to loan.
iii)Loan Exceptions: This is when a member wants to borrow amount above the amount open to loan.
iv)Loan Exception Approvals: This is only approved by the Loan committee.
v)Loan Exception Interest rate: when the borrower goes above amount open to loan (80%), the interest rate will be lifted to 5%.
6)Loan tenure: 3-12months
7)Meeting:
i)General meetings period: 2times a year.
ii)The meeting details shall be communicated to the members 28 days before.
8)Withdrawal from the Fund: A member is free to exit/withdraw his/her membership/shares from the Fund following below criteria.
i)Withdrawal of shares but retaining membership: Member will be charged 5% of the withdraw amount.
ii)Withdrawal membership, also known as LAST Withdrawal: Member will be charged 5% of his/her total shares and the rest will
be credited to the preferred account/Wallet Number of the member.
iii)Loan repayment using own shares/savings: 5% is chargeable.
9)Penalties :
i) Skipping monthly contributions, If a member skips his/her monthly contributions thrice(3), will be charged 2,000Rwf from his her
ii)Late loan repayment, 1% is charged per month
iii)Meeting attendance penalties:1,000Rwf which will be deducted from his/her shares.
Disclaimer: The T&C that consist of fees, charges & interest rates, are open to change due to different circumstances like growth of
the company or inflation. When these changes are to be applied, the investors will be informed 28days before.
`;

const registrationFormText = `
I …………………………………………………………………………………………………………… hereby
acknowledge receipt of a copy of terms and conditions and agree to abide by them and confirm the
information provided above is true & accurate. I will undertake to notify bankers’ Investment
Fund within 28days if there is any change of information that I have provided. I also consent
to use or share my information with Bankers ‘Investment Fund or the domestic authorities as per
the need.
DATE
Signature
`;

const generatePdf = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let y = 15;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("BANKERS’ INVESTMENT FUND", doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 7;
    doc.text("INVESTORS’ REGISTRATION FORM", doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 10;

    const fullText = termsAndConditionsText + registrationFormText;
    const lines = doc.splitTextToSize(fullText, 180);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    lines.forEach((line: string) => {
        if (y > pageHeight - 20) {
            doc.addPage();
            y = 15;
        }
        doc.text(line, 15, y);
        y += 7;
    });

    doc.save('Bankers_Investment_Fund_TC.pdf');
};


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
                  <AccordionContent className="h-48 overflow-y-auto pr-2 text-muted-foreground whitespace-pre-wrap">
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
            <Button variant="outline" type="button" onClick={generatePdf}>
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
