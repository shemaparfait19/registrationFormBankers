import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addressData } from '@/lib/address-data';
import { useEffect } from 'react';

type StepProps = {
  onNext: () => void;
  onPrev: () => void;
};


export default function AddressStep({ onNext, onPrev }: StepProps) {
  const form = useFormContext();
  const { control, watch, setValue } = form;

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
        <CardTitle>Address & Location</CardTitle>
        <CardDescription>Please provide your current residential address.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-medium">Current Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={control} name="country" render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl>
                  <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="province" render={({ field }) => (
              <FormItem>
                <FormLabel>Province / State / Region</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!watchedCountry}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a province" /></SelectTrigger></FormControl>
                  <SelectContent>{provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="district" render={({ field }) => (
              <FormItem>
                <FormLabel>District / County</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!watchedProvince}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a district" /></SelectTrigger></FormControl>
                  <SelectContent>{districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="sector" render={({ field }) => (
              <FormItem>
                <FormLabel>Sector / Ward</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!watchedDistrict}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a sector" /></SelectTrigger></FormControl>
                  <SelectContent>{sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="cell" render={({ field }) => (
              <FormItem>
                <FormLabel>Cell</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!watchedSector}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a cell" /></SelectTrigger></FormControl>
                  <SelectContent>{cells.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="village" render={({ field }) => (
              <FormItem>
                <FormLabel>Village / Estate</FormLabel>
                 <Select onValueChange={field.onChange} value={field.value} disabled={!watchedCell}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select a village" /></SelectTrigger></FormControl>
                  <SelectContent>{villages.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>
         <div className="space-y-4">
          <h3 className="font-medium">Work Information</h3>
          <FormField
              control={control}
              name="workAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Work Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., KN 4 Ave, Kigali" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev} type="button">Back</Button>
        <Button onClick={onNext} type="button">Continue</Button>
      </CardFooter>
    </Card>
  );
}
