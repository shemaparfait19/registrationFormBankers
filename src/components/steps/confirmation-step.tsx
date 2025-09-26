import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Download, LayoutDashboard, Plus, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type ConfirmationStepProps = {
  applicantName?: string;
  onRestart: () => void;
};

export default function ConfirmationStep({ applicantName, onRestart }: ConfirmationStepProps) {
    const [membershipId, setMembershipId] = useState('');

    useEffect(() => {
        // Generate a random membership ID for demonstration
        const randomId = `BIF-${Math.floor(100000 + Math.random() * 900000)}`;
        setMembershipId(randomId);
    }, []);

  return (
    <Card className="w-full step-card text-center">
      <CardHeader className="items-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <CardTitle className="text-3xl font-bold">Application Submitted!</CardTitle>
        <CardDescription className="text-lg">
          Congratulations, {applicantName || 'Applicant'}! Your application has been received.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground">Your Membership ID</p>
            <p className="text-2xl font-bold text-primary tracking-widest">{membershipId}</p>
        </div>
        <div className="text-left p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">What Happens Next?</h3>
            <ul className="space-y-2 text-muted-foreground text-sm list-decimal list-inside">
                <li>Your application will be reviewed by our team (1-2 business days).</li>
                <li>You will receive an email confirmation upon approval.</li>
                <li>Instructions for your first contribution will be included in the approval email.</li>
            </ul>
        </div>
         <p className="text-sm text-muted-foreground">For any queries, please contact our support team at <a href="mailto:support@investright.com" className="text-primary hover:underline">support@investright.com</a>.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Receipt</Button>
            <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
            <Button asChild>
                <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
            </Button>
            <Button variant="secondary" onClick={onRestart}><Plus className="mr-2 h-4 w-4" /> New App</Button>
        </div>
      </CardContent>
    </Card>
  );
}
