'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

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
      // Check response from backend
      if (response?.status === 'needs_verification') {
        setInfo('Please verify your email first. We\'ve sent you a new verification code.');
        setIsVerification(true);
      }
      setShowOTPInput(true);
    } catch (err: any) {
      console.error('OTP request error:', err);
      setError(err?.error?.message || 'Failed to send OTP. Please try again.');
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
        // Handle email verification
        await verifyEmail(email, otp);
        setInfo('Email verified successfully! You can now log in.');
        setShowOTPInput(false);
        setIsVerification(false);
      } else {
        // Handle normal login
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
      {!showOTPInput ? (
        <form onSubmit={handleRequestOTP} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              'Request Code'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmitOTP} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {info && (
            <Alert>
              <AlertDescription>{info}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="otp">
              {isVerification ? 'Verification Code' : 'Login Code'}
            </Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the 6-digit code"
              required
              maxLength={6}
              pattern="\d{6}"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isVerification ? 'Verifying...' : 'Logging in...'}
                </>
              ) : (
                isVerification ? 'Verify Email' : 'Login'
              )}
            </Button>
            <Button
              type="button"
              variant="link"
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
              Back to email
            </Button>
          </div>
        </form>
      )}

      <div className="text-center text-sm text-zinc-500">
        Don't have an account?{' '}
        <Button
          variant="link"
          className="px-0"
          onClick={() => router.push('/register')}
        >
          Create one now
        </Button>
      </div>
    </div>
  );
}