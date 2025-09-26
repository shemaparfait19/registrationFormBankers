import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, FileText, Clock } from 'lucide-react';

type WelcomeStepProps = {
  onNext: () => void;
};

const benefits = [
  'Professionally managed investment portfolio.',
  'Access to exclusive investment opportunities.',
  'Regular performance reports and updates.',
  'Potential for long-term capital growth.',
];

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <Card className="w-full step-card">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Welcome to Bankers Investment Fund</CardTitle>
        <CardDescription className="text-center text-lg">
          Your journey to financial growth starts here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-muted-foreground">
          <p>This registration process is designed to be quick and easy. Please have the necessary documents ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Key Benefits</h3>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Before You Start</h3>
               <div className="flex items-center text-muted-foreground">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span>Estimated completion time: <strong>8-10 minutes</strong></span>
              </div>
            </div>
            <div>
               <h3 className="font-semibold text-lg mb-2">Required Documents</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" /><span>Valid National ID or Passport</span></li>
                <li className="flex items-start"><CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" /><span>Next of Kin contact information</span></li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
        <Button size="lg" onClick={onNext} className="w-full sm:w-auto">Start Registration</Button>
        <Button size="lg" variant="outline" className="w-full sm:w-auto">
          <FileText className="mr-2 h-4 w-4" />
          Download Terms PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
