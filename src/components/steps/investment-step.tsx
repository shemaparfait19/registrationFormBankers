import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useMemo } from 'react';

type StepProps = {
  onNext: () => void;
  onPrev: () => void;
};

const SHARE_PRICE = 1000; // RWF per share

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
  const investmentAmount = form.watch('investmentAmount');

  const shares = useMemo(() => {
    return investmentAmount >= SHARE_PRICE ? Math.floor(investmentAmount / SHARE_PRICE) : 0;
  }, [investmentAmount]);

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
              control={form.control}
              name="investmentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount in RWF</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        className="pr-24 text-lg"
                        placeholder="e.g., 50000"
                        value={field.value}
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
                      max={200000}
                      step={1000}
                      className="mt-4"
                    />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-primary font-medium">Calculated Shares</p>
              <p className="text-3xl font-bold text-primary">{shares.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                Based on a share price of {SHARE_PRICE.toLocaleString()} RWF
              </p>
            </div>
          </div>
          <div className="space-y-4">
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
