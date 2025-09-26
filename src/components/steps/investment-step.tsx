import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Ticket, Wand2 } from 'lucide-react';
import { convertNumberToWords } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';

type StepProps = {
  onNext: () => void;
  onPrev: () => void;
};

const SHARE_PRICE = 15000; // RWF per share

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Contributions (RWF '000)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function InvestmentStep({ onNext, onPrev }: StepProps) {
  const form = useFormContext();
  const { control, watch, setValue } = form;
  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);

  const investmentAmount = watch('investmentAmount');

  const shares = useMemo(() => {
    return investmentAmount >= SHARE_PRICE ? Math.floor(investmentAmount / SHARE_PRICE) : 0;
  }, [investmentAmount]);

  const handleConvertToWords = useCallback(async (amount: number) => {
    if (amount < 1) {
      setValue('investmentAmountInWords', '');
      return;
    }
    setIsConverting(true);
    try {
      const result = await convertNumberToWords(amount);
      if (result.success && result.words) {
        setValue('investmentAmountInWords', result.words);
      } else {
        toast({
          variant: 'destructive',
          title: 'Conversion Failed',
          description: result.error || 'Could not convert number to words.',
        });
      }
    } finally {
      setIsConverting(false);
    }
  }, [setValue, toast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        handleConvertToWords(investmentAmount);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [investmentAmount, handleConvertToWords]);


  return (
    <Card className="w-full step-card">
      <CardHeader>
        <CardTitle>Monthly Investment</CardTitle>
        <CardDescription>Specify your desired monthly contribution amount.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h3 className="font-medium">Contribution Amount</h3>
            <FormField
              control={control}
              name="investmentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount in Figures (RWF)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        className="pr-24 text-lg"
                        placeholder="e.g., 50000"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                       <span className="absolute inset-y-0 right-4 flex items-center text-lg font-semibold text-muted-foreground">
                        RWF
                      </span>
                    </div>
                  </FormControl>
                   <Slider
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      max={500000}
                      step={5000}
                      className="mt-4"
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="investmentAmountInWords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount in Words</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <Textarea
                          readOnly
                          placeholder="Amount in words will appear here..."
                          {...field}
                          className="pr-10 bg-gray-50"
                        />
                       {isConverting && (
                        <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="space-y-4">
                <h3 className="font-medium">Referral Information</h3>
                <FormField
                    control={control}
                    name="referralCode"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Referral Code (Optional)</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Enter referral code" 
                                    {...field}
                                    className="pl-10"
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
          </div>
          <div className="space-y-4">
             <div className="p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-primary font-medium">Calculated Shares</p>
              <p className="text-3xl font-bold text-primary">{shares.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                Based on a share price of {SHARE_PRICE.toLocaleString()} RWF
              </p>
            </div>
            <h3 className="font-medium">Typical Member Contributions</h3>
            <Card className="h-64">
              <CardContent className="h-full p-2">
                 <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 10 }}>
                    <CartesianGrid vertical={false} />
                     <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                       tickFormatter={(value) => `${value}`}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev} type="button">Back</Button>
        <Button onClick={onNext} type="button">Continue</Button>
      </CardFooter>
    </Card>
  );
}
