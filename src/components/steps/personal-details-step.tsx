import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addressData } from '@/lib/address-data';
import { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Info } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';


type StepProps = {
  onNext: () => void;
  onPrev: () => void;
};

export default function PersonalDetailsStep({ onNext, onPrev }: StepProps) {
  const form = useFormContext();
  const { control, watch, setValue } = form;

  const idNumber = watch('idNumber');
  const isPassport = idNumber && idNumber.length > 5 && idNumber.length !== 16;

  const watchedCountry = watch('country');
  const watchedProvince = watch('province');
  const watchedDistrict = watch('district');
  const watchedSector = watch('sector');
  const watchedCell = watch('cell');

  const countries = Object.keys(addressData);
  const provinces = watchedCountry ? Object.keys(addressData[watchedCountry as keyof typeof addressData] || {}) : [];
  const districts = watchedProvince ? Object.keys(addressData[watchedCountry as keyof typeof addressData]?.[watchedProvince as keyof typeof addressData[keyof typeof addressData]] || {}) : [];
  const sectors = watchedDistrict ? Object.keys(addressData[watchedCountry as keyof typeof addressData]?.[watchedProvince as keyof typeof addressData[keyof typeof addressData]]?.[watchedDistrict] || {}) : [];
  const cells = watchedSector ? Object.keys(addressData[watchedCountry as keyof typeof addressData]?.[watchedProvince as keyof typeof addressData[keyof typeof addressData]]?.[watchedDistrict]?.[watchedSector] || {}) : [];
  const villages = watchedCell ? addressData[watchedCountry as keyof typeof addressData]?.[watchedProvince as keyof typeof addressData[keyof typeof addressData]]?.[watchedDistrict]?.[watchedSector]?.[watchedCell] || [] : [];
  
  // Reset dependent fields when a parent changes
  useEffect(() => {
    setValue('province', '');
    setValue('district', '');
    setValue('sector', '');
    setValue('cell', '');
    setValue('village', '');
  }, [watchedCountry, setValue]);

  useEffect(() => {
    setValue('district', '');
    setValue('sector', '');
    setValue('cell', '');
    setValue('village', '');
  }, [watchedProvince, setValue]);

  useEffect(() => {
    setValue('sector', '');
    setValue('cell', '');
    setValue('village', '');
  }, [watchedDistrict, setValue]);

  useEffect(() => {
    setValue('cell', '');
    setValue('village', '');
  }, [watchedSector, setValue]);
  
  useEffect(() => {
    setValue('village', '');
  }, [watchedCell, setValue]);

  return (
    <Card className="w-full step-card">
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>Please fill out your personal, address, and identification details below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-medium">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={control} name="fullName" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="sex" render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Sex</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4 pt-2">
                    <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Male" /></FormControl><FormLabel className="font-normal">Male</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Female" /></FormControl><FormLabel className="font-normal">Female</FormLabel></FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="maritalStatus" render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="font-medium">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={control} name="mobile1" render={({ field }) => (
              <FormItem><FormLabel>Mobile Number 1</FormLabel><FormControl><Input placeholder="07..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="mobile2" render={({ field }) => (
              <FormItem><FormLabel>Mobile Number 2 (Optional)</FormLabel><FormControl><Input placeholder="07..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="email" render={({ field }) => (
              <FormItem className="md:col-span-2"><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="example@email.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="font-medium">Current Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={control} name="country" render={({ field }) => (
              <FormItem><FormLabel>Country</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl><SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="province" render={({ field }) => (
              <FormItem><FormLabel>Province / State</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!watchedCountry}><FormControl><SelectTrigger><SelectValue placeholder="Select a province" /></SelectTrigger></FormControl><SelectContent>{provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="district" render={({ field }) => (
              <FormItem><FormLabel>District / County</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!watchedProvince}><FormControl><SelectTrigger><SelectValue placeholder="Select a district" /></SelectTrigger></FormControl><SelectContent>{districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="sector" render={({ field }) => (
              <FormItem><FormLabel>Sector / Ward</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!watchedDistrict}><FormControl><SelectTrigger><SelectValue placeholder="Select a sector" /></SelectTrigger></FormControl><SelectContent>{sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="cell" render={({ field }) => (
              <FormItem><FormLabel>Cell</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!watchedSector}><FormControl><SelectTrigger><SelectValue placeholder="Select a cell" /></SelectTrigger></FormControl><SelectContent>{cells.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="village" render={({ field }) => (
              <FormItem><FormLabel>Village / Estate</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!watchedCell}><FormControl><SelectTrigger><SelectValue placeholder="Select a village" /></SelectTrigger></FormControl><SelectContent>{villages.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="workAddress" render={({ field }) => (
              <FormItem className="md:col-span-2"><FormLabel>Current Work Address (Optional)</FormLabel><FormControl><Input placeholder="e.g., KN 4 Ave, Kigali" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        {/* Identification & Emergency Contact */}
        <div className="space-y-4">
          <h3 className="font-medium">Identification & Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={control} name="idNumber" render={({ field }) => (
              <FormItem><FormLabel>ID / Passport Number</FormLabel><FormControl><Input placeholder="Enter your ID or Passport number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            {isPassport && (
              <FormField control={control} name="passportExpiryDate" render={({ field }) => (
                <FormItem className="flex flex-col pt-2"><FormLabel>Passport Expiry Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                    <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus /></PopoverContent></Popover><FormMessage />
                </FormItem>
              )} />
            )}
           </div>
           <div className="flex items-start rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 mt-6">
                <Info className="mr-3 h-5 w-5 flex-shrink-0" />
                <p>This person will be contacted in case of an emergency or if we cannot reach you.</p>
            </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
             <FormField control={control} name="nextOfKinName" render={({ field }) => (
              <FormItem><FormLabel>Next of Kin Full Name</FormLabel><FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="nextOfKinContact" render={({ field }) => (
              <FormItem><FormLabel>Next of Kin Contact</FormLabel><FormControl><Input placeholder="07..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
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
