import { z } from 'zod';

export const PersonalDetailsSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters.' }),
  sex: z.enum(['Male', 'Female'], { required_error: 'Please select your gender.' }),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed'], { required_error: 'Please select a marital status.' }),
  mobile1: z.string().regex(/^(07[8,2,3,9])[0-9]{7}$/, { message: 'Please enter a valid Rwandan mobile number (e.g., 07...)' }),
  mobile2: z.string().regex(/^(07[8,2,3,9])[0-9]{7}$/, { message: 'Please enter a valid Rwandan mobile number (e.g., 07...)' }).optional().or(z.literal('')),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export const AddressSchema = z.object({
  country: z.string().min(1, { message: 'Country is required.' }),
  province: z.string().min(1, { message: 'Province is required.' }),
  district: z.string().min(1, { message: 'District is required.' }),
  sector: z.string().min(1, { message: 'Sector is required.' }),
  cell: z.string().min(1, { message: 'Cell is required.' }),
  village: z.string().min(1, { message: 'Village is required.' }),
  workAddress: z.string().optional(),
});

export const IdentificationSchema = z.object({
  idNumber: z.string().min(5, { message: 'ID/Passport number must be at least 5 characters.' }),
  passportExpiryDate: z.date().optional(),
  nextOfKinName: z.string().min(3, { message: 'Next of kin name is required.' }),
  nextOfKinContact: z.string().regex(/^(07[8,2,3,9])[0-9]{7}$/, { message: 'Please enter a valid Rwandan mobile number.' }),
});

export const InvestmentSchema = z.object({
    investmentAmount: z.number().min(15000, { message: "Investment must be at least 15,000 RWF (1 share)." }),
    referralCode: z.string().optional(),
});

export const AgreementSchema = z.object({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
  consentToSharing: z.boolean().refine((val) => val === true, {
    message: 'You must consent to information sharing.',
  }),
  confirmAccuracy: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the accuracy of your information.',
  }),
  signature: z.string().min(3, { message: 'Please provide your full name as a signature.' }),
});

export const FormSchema = PersonalDetailsSchema.merge(AddressSchema).merge(IdentificationSchema).merge(InvestmentSchema).merge(AgreementSchema);

export type FormState = z.infer<typeof FormSchema>;

export const StepFields: (keyof FormState)[][] = [
  [], // Welcome step has no fields
  ['fullName', 'sex', 'maritalStatus', 'mobile1', 'mobile2', 'email'],
  ['country', 'province', 'district', 'sector', 'cell', 'village', 'workAddress'],
  ['idNumber', 'passportExpiryDate', 'nextOfKinName', 'nextOfKinContact'],
  ['investmentAmount', 'referralCode'],
  ['acceptTerms', 'consentToSharing', 'confirmAccuracy', 'signature'],
];
