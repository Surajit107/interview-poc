'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Upload, X } from 'lucide-react';
import { MicroLoading } from '@/components/ui/micro-loading';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { signupUser, sendVerificationEmail, verifyEmail, clearError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { BUSINESS_CATEGORIES, FILE_UPLOAD, VALIDATION_RULES } from '@/constants';

// Step 1: Basic Information
const basicInfoSchema = z.object({
  name: z.string().min(VALIDATION_RULES.NAME_MIN_LENGTH, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Step 2: Email Verification
const emailVerificationSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// Step 3: Business Details
const businessDetailsSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  businessAddress: z.string().min(1, 'Business address is required'),
  businessPhone: z.string().regex(VALIDATION_RULES.PHONE_PATTERN, 'Invalid phone number'),
  businessCategory: z.string().min(1, 'Please select a business category'),
  termsAccepted: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
});

type BasicInfoData = z.infer<typeof basicInfoSchema>;
type EmailVerificationData = z.infer<typeof emailVerificationSchema>;
type BusinessDetailsData = z.infer<typeof businessDetailsSchema>;

export function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);

  // Form for basic information
  const basicInfoForm = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Form for email verification
  const emailVerificationForm = useForm<EmailVerificationData>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Form for business details
  const businessDetailsForm = useForm<BusinessDetailsData>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      businessName: '',
      businessAddress: '',
      businessPhone: '',
      businessCategory: '',
      termsAccepted: false,
    },
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // File upload handling
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > FILE_UPLOAD.MAX_SIZE) {
        alert('File size must be less than 5MB');
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
    },
    multiple: false,
  });

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  // Step 1: Basic Information
  const onBasicInfoSubmit = async (data: BasicInfoData) => {
    dispatch(clearError());
    
    const result = await dispatch(signupUser({
      name: data.name,
      email: data.email,
      password: data.password,
      businessName: '',
      businessAddress: '',
      businessPhone: '',
      businessCategory: '',
      profileImage: undefined,
      termsAccepted: false,
    }));

    if (signupUser.fulfilled.match(result)) {
      setCurrentStep(2);
      // Send verification email
      await dispatch(sendVerificationEmail(data.email));
      setOtpSent(true);
    }
  };

  // Step 2: Email Verification
  const onEmailVerificationSubmit = async (data: EmailVerificationData) => {
    dispatch(clearError());
    
    const result = await dispatch(verifyEmail(data.otp));
    
    if (verifyEmail.fulfilled.match(result)) {
      setCurrentStep(3);
    }
  };

  const resendOTP = async () => {
    if (otpResendCooldown > 0) return;
    
    const email = basicInfoForm.getValues('email');
    await dispatch(sendVerificationEmail(email));
    setOtpSent(true);
    setOtpResendCooldown(60);
    
    const interval = setInterval(() => {
      setOtpResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 3: Business Details
  const onBusinessDetailsSubmit = async (data: BusinessDetailsData) => {
    dispatch(clearError());
    
    const result = await dispatch(signupUser({
      name: basicInfoForm.getValues('name'),
      email: basicInfoForm.getValues('email'),
      password: basicInfoForm.getValues('password'),
      businessName: data.businessName,
      businessAddress: data.businessAddress,
      businessPhone: data.businessPhone,
      businessCategory: data.businessCategory,
      profileImage: profileImage || undefined,
      termsAccepted: data.termsAccepted,
    }));

    if (signupUser.fulfilled.match(result)) {
      setCurrentStep(4);
    }
  };

  // Step 4: Success
  const handleComplete = () => {
    router.push('/dashboard');
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...basicInfoForm.register('name')}
                className={basicInfoForm.formState.errors.name ? 'border-red-500' : ''}
              />
              {basicInfoForm.formState.errors.name && (
                <p className="text-sm text-red-600">{basicInfoForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...basicInfoForm.register('email')}
                className={basicInfoForm.formState.errors.email ? 'border-red-500' : ''}
              />
              {basicInfoForm.formState.errors.email && (
                <p className="text-sm text-red-600">{basicInfoForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  {...basicInfoForm.register('password')}
                  className={basicInfoForm.formState.errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {basicInfoForm.formState.errors.password && (
                <p className="text-sm text-red-600">{basicInfoForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  {...basicInfoForm.register('confirmPassword')}
                  className={basicInfoForm.formState.errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {basicInfoForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">{basicInfoForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <MicroLoading size="sm" className="mr-2" />
                  Creating Account...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={emailVerificationForm.handleSubmit(onEmailVerificationSubmit)} className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Verify Your Email</h3>
              <p className="text-sm text-gray-600">
                We&apos;ve sent a verification code to <strong>{basicInfoForm.getValues('email')}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="Enter 6-digit code"
                maxLength={6}
                {...emailVerificationForm.register('otp')}
                className={emailVerificationForm.formState.errors.otp ? 'border-red-500' : ''}
              />
              {emailVerificationForm.formState.errors.otp && (
                <p className="text-sm text-red-600">{emailVerificationForm.formState.errors.otp.message}</p>
              )}
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={resendOTP}
                disabled={otpResendCooldown > 0}
                className="text-sm"
              >
                {otpResendCooldown > 0 ? `Resend in ${otpResendCooldown}s` : 'Resend Code'}
              </Button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                <strong>Demo OTP:</strong> 123456
              </p>
            </div>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={goToPreviousStep} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <MicroLoading size="sm" className="mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={businessDetailsForm.handleSubmit(onBusinessDetailsSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                {...businessDetailsForm.register('businessName')}
                className={businessDetailsForm.formState.errors.businessName ? 'border-red-500' : ''}
              />
              {businessDetailsForm.formState.errors.businessName && (
                <p className="text-sm text-red-600">{businessDetailsForm.formState.errors.businessName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea
                id="businessAddress"
                placeholder="Enter your business address"
                {...businessDetailsForm.register('businessAddress')}
                className={businessDetailsForm.formState.errors.businessAddress ? 'border-red-500' : ''}
              />
              {businessDetailsForm.formState.errors.businessAddress && (
                <p className="text-sm text-red-600">{businessDetailsForm.formState.errors.businessAddress.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessPhone">Business Phone</Label>
              <Input
                id="businessPhone"
                placeholder="Enter your business phone"
                {...businessDetailsForm.register('businessPhone')}
                className={businessDetailsForm.formState.errors.businessPhone ? 'border-red-500' : ''}
              />
              {businessDetailsForm.formState.errors.businessPhone && (
                <p className="text-sm text-red-600">{businessDetailsForm.formState.errors.businessPhone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessCategory">Business Category</Label>
              <Select onValueChange={(value) => businessDetailsForm.setValue('businessCategory', value)}>
                <SelectTrigger className={businessDetailsForm.formState.errors.businessCategory ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select business category" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {businessDetailsForm.formState.errors.businessCategory && (
                <p className="text-sm text-red-600">{businessDetailsForm.formState.errors.businessCategory.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Business Profile Image (Optional)</Label>
              {!imagePreview ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="termsAccepted"
                checked={businessDetailsForm.watch('termsAccepted')}
                onCheckedChange={(checked) => businessDetailsForm.setValue('termsAccepted', checked as boolean)}
              />
              <Label htmlFor="termsAccepted" className="text-sm">
                I accept the{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>
              </Label>
            </div>
            {businessDetailsForm.formState.errors.termsAccepted && (
              <p className="text-sm text-red-600">{businessDetailsForm.formState.errors.termsAccepted.message}</p>
            )}

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={goToPreviousStep} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <MicroLoading size="sm" className="mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </div>
          </form>
        );

      case 4:
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Account Created Successfully!</h3>
            <p className="text-sm text-gray-600">
              Welcome to the Retailer Panel. Your account has been set up and you&apos;re ready to start managing your business.
            </p>
            <Button onClick={handleComplete} className="w-full">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          {currentStep === 1 && 'Enter your basic information'}
          {currentStep === 2 && 'Verify your email address'}
          {currentStep === 3 && 'Complete your business details'}
          {currentStep === 4 && 'Welcome to Retailer Panel!'}
        </CardDescription>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <Progress value={progress} className="h-2" />
        </div>
        <p className="text-xs text-center text-gray-500">
          Step {currentStep} of {totalSteps}
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}
        
        {renderStepContent()}
      </CardContent>
    </Card>
  );
}
