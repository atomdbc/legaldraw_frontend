'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Mail, 
  ArrowLeft,
  KeyRound
} from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const { requestLoginOTP, verifyLoginOTP, verifyEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [isVerification, setIsVerification] = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const response = await requestLoginOTP(email);
      if (response?.status === 'needs_verification') {
        setInfo('Please verify your email first. We\'ve sent you a new verification code.');
        setIsVerification(true);
      }
      setShowOTPInput(true);
    } catch (err: any) {
      console.error('OTP request error:', err);
      setError(err?.error?.message || 'Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isVerification) {
        await verifyEmail(email, otp);
        setInfo('Email verified successfully! You can now log in.');
        setShowOTPInput(false);
        setIsVerification(false);
      } else {
        await verifyLoginOTP(email, otp);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err?.error?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          {showOTPInput ? 'Enter verification code' : 'Welcome back'}
        </h1>
        <p className="text-sm text-gray-500">
          {showOTPInput 
            ? `We've sent a code to ${email}`
            : 'Sign in to your workspace'}
        </p>
      </div>

      {!showOTPInput ? (
        <form onSubmit={handleRequestOTP} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email address</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="pl-10"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#4361EE] hover:bg-[#3651D4] text-white" 
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              'Continue with Email'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmitOTP} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {info && (
            <Alert className="bg-[#4361EE]/10 text-[#4361EE] border-[#4361EE]/20">
              <AlertDescription>{info}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                pattern="\d{6}"
                className="pl-10 text-center text-lg"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Didn't receive the code? <Button variant="link" className="px-1 h-auto text-[#4361EE]">Resend</Button>
            </p>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full bg-[#4361EE] hover:bg-[#3651D4] text-white"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isVerification ? 'Verifying...' : 'Signing in...'}
                </>
              ) : (
                isVerification ? 'Verify Email' : 'Sign In'
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setShowOTPInput(false);
                setIsVerification(false);
                setOtp('');
                setInfo('');
                setError('');
              }}
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </form>
      )}

      <div className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Button 
          variant="link" 
          className="px-1 h-auto text-[#4361EE]" 
          onClick={() => router.push('/register')}
        >
          Create one now
        </Button>
      </div>
    </div>
  );
}