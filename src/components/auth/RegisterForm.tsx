'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

type FormData = {
  email: string;
  fullName: string;
  organization: string;
};

export function RegisterForm() {
  const router = useRouter();
  const { register, verifyLoginOTP } = useAuth();  // Changed to use verifyLoginOTP like login form
  const [formData, setFormData] = useState<FormData>({
    email: '',
    fullName: '',
    organization: ''
  });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register(
        formData.email,
        formData.fullName,
        formData.organization
      );
      setShowOTPInput(true);
      setInfo('Please enter the verification code sent to your email.');
    } catch (err: any) {
      const message = err?.error?.message || 
                     err?.message || 
                     'Registration failed. Please try again.';
      setError(typeof message === 'object' ? JSON.stringify(message) : message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Using verifyLoginOTP instead of verifyEmail
      await verifyLoginOTP(formData.email, otp);
      // The verifyLoginOTP function will handle the redirect to dashboard
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err?.error?.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {showOTPInput ? 'Verify your email' : 'Create your account'}
        </h1>
        <p className="text-sm text-zinc-500">
          {showOTPInput 
            ? `Enter the verification code sent to ${formData.email}`
            : 'Enter your details to get started with LegalDraw AI'}
        </p>
      </div>

      {!showOTPInput ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  name="organization"
                  placeholder="Legal Firm LLC"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-zinc-500">
                We'll send you a verification code to this email
              </p>
            </div>
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
                Creating account...
              </>
            ) : (
              'Create Free Account'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
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
            <Label htmlFor="otp">Verification Code</Label>
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
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => {
                setShowOTPInput(false);
                setOtp('');
                setInfo('');
                setError('');
              }}
              disabled={loading}
            >
              Back to registration
            </Button>
          </div>
        </form>
      )}

      <div className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Button variant="link" className="px-0" onClick={() => router.push('/login')}>
          Sign in
        </Button>
      </div>
    </div>
  );
}