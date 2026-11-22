'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowLeft, Lock } from 'lucide-react';
import {
  loginSchema,
  LoginFormData,
} from '@/components/features/auth/schemas/auth.schema';
import { loginAdmin } from '@/components/features/auth/auth.api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // const onSubmit = async (data: LoginFormData) => {
  //   try {
  //     setServerError('');

  //     const response = await loginAdmin(data);
  //     const { accessToken, id, name, email, role } = response;

  //     if (role !== 'municipal_admin') {
  //       setServerError(
  //         'Unauthorized. Only Municipal Administrators can sign in through this portal.'
  //       );
  //       return;
  //     }

  //     sessionStorage.setItem('accessToken', accessToken);
  //     sessionStorage.setItem(
  //       'user',
  //       JSON.stringify({ id, name, email, role })
  //     );

  //     router.push('/municipality/overview');
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       const responseData = error.response?.data;

  //       if (responseData?.errors) {
  //         const firstError = Object.values(responseData.errors)
  //           .flat()
  //           .find((msg) => typeof msg === 'string');
  //         setServerError(firstError || 'Admin authentication failed.');
  //       } else {
  //         setServerError(
  //           responseData?.message || 'Invalid administrator email or password.'
  //         );
  //       }
  //     } else {
  //       setServerError('Unable to connect to the server. Please try again.');
  //     }
  //   }
  // };


  const onSubmit = async (data: LoginFormData) => {
  try {
    setServerError('');

    const response = await loginAdmin(data);
    const { accessToken, id, name, email, role } = response;

    if (role !== 'municipal_admin') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setServerError(
        'Unauthorized. Only Municipal Administrators can sign in through this portal.'
      );
      return;
    }

    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem(
      'user',
      JSON.stringify({ id, name, email, role })
    );

    router.push('/municipality/overview');
  } catch (error) {
    // ... existing error handling
  }
};

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-primary"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck size={14} />
              Municipal Administration
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Admin Portal Login
            </h1>
            <p className="text-xs text-muted">
              Sign in with your system-provisioned Municipal Admin credentials to oversee all wards, budgets, and official approvals.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Admin Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Admin Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@wardwatch.gov.np"
                autoComplete="email"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
              >
                {serverError}
              </div>
            )}
             
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {isSubmitting ? 'Authenticating...' : 'Login to Admin Console'}
            </button>
          </form>

          {/* Provisioned Account Notice */}
          <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/70 p-3.5 text-xs text-muted">
            <Lock size={15} className="mt-0.5 shrink-0 text-primary" />
            <span>
              Municipal Admin accounts cannot be self-registered. Contact the system database administrator if you need access credentials.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}