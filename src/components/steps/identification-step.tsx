import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Info } from 'lucide-react';

type StepProps = {
  onNext: () => void;
  onPrev: () => void;
};

export default function IdentificationStep({ onNext, onPrev }: StepProps) {
  const form = useFormContext();
  const idNumber = form.watch('idNumber');
  // Simple logic: assume it's a passport if it's not a 16-digit Rwandan ID number
  const isPassport = idNumber && idNumber.length > 5 && idNumber.length !== 16;

  return (
    <Card className="w-full step-card">
      <CardHeader>
        <CardTitle>ID & Emergency Contact</CardTitle>
        <CardDescription>Please provide your identification and a contact for emergencies.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-medium">Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID / Passport Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your ID or Passport number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isPassport && (
              <FormField
                control={form.control}
                name="passportExpiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Passport Expiry Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Emergency Contact</h3>
           <div className="flex items-start rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                <Info className="mr-3 h-5 w-5 flex-shrink-0" />
                <p>This person will be contacted in case of an emergency or if we cannot reach you.</p>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nextOfKinName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next of Kin Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nextOfKinContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next of Kin Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="07..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
