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
  Building2, 
  Mail, 
  User,
  ArrowLeft
} from 'lucide-react';

type FormData = {
  email: string;
  fullName: string;
  organization: string;
};

export function RegisterForm() {
  const router = useRouter();
  const { register, verifyLoginOTP } = useAuth();
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
      await register({
        email: formData.email,
        full_name: formData.fullName,
        company: formData.organization
      });
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
      await verifyLoginOTP(formData.email, otp);
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
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          {showOTPInput ? 'Verify your email' : 'Create your account'}
        </h1>
        <p className="text-sm text-gray-500">
          {showOTPInput 
            ? `Enter the verification code sent to ${formData.email}`
            : 'Start creating perfect documents with Docwelo AI'}
        </p>
      </div>

      {!showOTPInput ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700">Full name</Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-gray-700">Organization</Label>
                <div className="relative">
                  <Input
                    id="organization"
                    name="organization"
                    placeholder="Legal Firm LLC"
                    value={formData.organization}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Work email</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
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
                Creating account...
              </>
            ) : (
              'Create Free Account'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
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
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
              pattern="\d{6}"
              className="text-center text-lg"
            />
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
                  Verifying...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setShowOTPInput(false);
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
        Already have an account?{' '}
        <Button 
          variant="link" 
          className="px-1 h-auto text-[#4361EE]" 
          onClick={() => router.push('/login')}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}