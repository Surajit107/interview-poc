'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { MicroLoading } from '@/components/ui/micro-loading';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginUser, setRememberMe, clearError } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { AUTH_CONSTANTS } from '@/constants';
import { storageService } from '@/shared/services/storage';
import { useAuthPersistence } from '@/hooks/useAuthPersistence';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { isLoading, error, rememberMe } = useSelector((state: RootState) => state.auth);
  const { isUserRemembered } = useAuthPersistence();

  // Get saved email from storage
  const savedAuthData = storageService.getAuthData();
  const savedEmail = savedAuthData?.email || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: savedEmail,
      password: '',
      rememberMe: isUserRemembered || rememberMe,
    },
  });

  // Update form when rememberMe state changes
  useEffect(() => {
    setValue('rememberMe', isUserRemembered || rememberMe);
  }, [isUserRemembered, rememberMe, setValue]);

  const watchedRememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    dispatch(clearError());
    
    // Update remember me state
    dispatch(setRememberMe(data.rememberMe || false));
    
    const result = await dispatch(loginUser({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe || false,
    }));

    if (loginUser.fulfilled.match(result)) {
      router.push('/dashboard');
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setValue('rememberMe', checked);
    dispatch(setRememberMe(checked));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your retailer account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password')}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={watchedRememberMe}
              onCheckedChange={handleRememberMeChange}
            />
            <Label htmlFor="rememberMe" className="text-sm font-normal">
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <MicroLoading size="sm" className="mr-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-500">
              Email: {AUTH_CONSTANTS.MOCK_CREDENTIALS.email}
            </p>
            <p className="text-xs text-gray-500">
              Password: {AUTH_CONSTANTS.MOCK_CREDENTIALS.password}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
