'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isEmailOtpVerified, setIsEmailOtpVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm();

  const watchPassword = useWatch({ control, name: 'password' });

  const handleSendEmailOTP = async () => {
    const email = watch('email');
    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/users/email-otp', { email });
      if (response.status === 200) {
        setIsEmailOtpSent(true);
        setOtpSent(true);
        setMessage('OTP sent to your email successfully!');
      }
    } catch (error) {
      console.error('Error sending email OTP:', error);
      setMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOTP = async () => {
    const email = watch('email');
    if (!emailOTP) {
      setMessage('Please enter the OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/users/verify-email-otp', {
        email,
        otp: emailOTP,
      });
      if (response.status === 200) {
        setIsEmailOtpVerified(true);
        setOtpVerified(true);
        setMessage('OTP verified successfully!');
      }
    } catch (error) {
      console.error('Error verifying email OTP:', error);
      setMessage(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!isEmailOtpVerified) {
      setMessage('Please verify OTP before resetting your password.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await axiosInstance.post('/users/forget-password', {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        setMessage('Password reset successfully! Redirecting...');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginBackground min-h-screen w-full flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-black-800/90"></div>
      <Card className="relative z-10 w-full max-w-md bg-white shadow-lg p-6 rounded-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Ship className="h-6 w-6" />
            <CardTitle
              className="text-2xl font-bold cursor-pointer"
              onClick={() => router.push('/')}
            >
              Ship Duniya
            </CardTitle>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Reset your password securely
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email & Send OTP */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex flex-row gap-2 items-center">
                <Input
                  id="email"
                  placeholder="Enter your email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  disabled={isEmailOtpSent}
                />
                <Button
                  className="h-8 bg-primary text-white"
                  onClick={handleSendEmailOTP}
                  disabled={isEmailOtpSent || loading}
                  type="button"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send OTP'}
                </Button>
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* OTP & Verify OTP */}
            {isEmailOtpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit OTP"
                    value={emailOTP}
                    onChange={(e) => setEmailOTP(e.target.value)}
                    disabled={isEmailOtpVerified}
                  />
                  <Button
                    className="h-8 bg-primary text-white"
                    onClick={handleVerifyEmailOTP}
                    disabled={isEmailOtpVerified || loading}
                    type="button"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify OTP'}
                  </Button>
                </div>
              </div>
            )}

            {/* New Password */}
            {isEmailOtpVerified && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Must be at least 8 characters' },
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message:
                            'Must contain uppercase, lowercase, number & special character',
                        },
                      })}
                    />
                    <Button
                      className="absolute right-2 top-2 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      variant="ghost"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === watchPassword || 'Passwords do not match',
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Submit */}
            {isEmailOtpVerified && (
              <Button
                className="h-8 bg-primary text-white w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </Button>
            )}
          </form>

          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                message.includes('successfully') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Back to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
