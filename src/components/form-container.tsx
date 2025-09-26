'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { FormSchema, StepFields } from '@/lib/schema';
import ProgressIndicator from './progress-indicator';
import WelcomeStep from './steps/welcome-step';
import PersonalDetailsStep from './steps/personal-details-step';
import AddressStep from './steps/address-step';
import IdentificationStep from './steps/identification-step';
import InvestmentStep from './steps/investment-step';
import AgreementStep from './steps/agreement-step';
import ConfirmationStep from './steps/confirmation-step';

const stepDetails = [
  { name: 'Welcome' },
  { name: 'Personal' },
  { name: 'Address' },
  { name: 'Identification' },
  { name: 'Investment' },
  { name: 'Agreement' },
];

export default function FormContainer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<z.infer<typeof FormSchema> | null>(
    null
  );

  const methods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      sex: undefined,
      maritalStatus: undefined,
      mobile1: '',
      mobile2: '',
      email: '',
      country: 'Rwanda',
      province: '',
      district: '',
      sector: '',
      cell: '',
      village: '',
      workAddress: '',
      idNumber: '',
      passportExpiryDate: undefined,
      nextOfKinName: '',
      nextOfKinContact: '',
      investmentAmount: 15000,
      referralCode: '',
      acceptTerms: false,
      consentToSharing: false,
      confirmAccuracy: false,
      signature: '',
    },
  });

  const { trigger, handleSubmit } = methods;

  const handleNext = async () => {
    const fieldsToValidate = StepFields[currentStep];
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const processForm = (data: z.infer<typeof FormSchema>) => {
    console.log('Form Submitted:', data);
    setFormData(data);
    setCurrentStep(prev => prev + 1);
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-8">
        {currentStep < stepDetails.length && (
          <ProgressIndicator
            steps={stepDetails.map(s => s.name)}
            currentStep={currentStep}
          />
        )}
        <form onSubmit={handleSubmit(processForm)}>
          {currentStep === 0 && (
            <WelcomeStep onNext={() => setCurrentStep(1)} />
          )}
          {currentStep === 1 && (
            <PersonalDetailsStep onNext={handleNext} onPrev={handlePrev} />
          )}
          {currentStep === 2 && (
            <AddressStep onNext={handleNext} onPrev={handlePrev} />
          )}
          {currentStep === 3 && (
            <IdentificationStep onNext={handleNext} onPrev={handlePrev} />
          )}
          {currentStep === 4 && (
            <InvestmentStep onNext={handleNext} onPrev={handlePrev} />
          )}
          {currentStep === 5 && <AgreementStep onPrev={handlePrev} />}
          {currentStep === 6 && (
            <ConfirmationStep
              applicantName={methods.getValues('fullName')}
              onRestart={() => {
                methods.reset();
                setCurrentStep(0);
              }}
            />
          )}
        </form>
      </div>
    </FormProvider>
  );
}
