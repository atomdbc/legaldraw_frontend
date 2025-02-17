// src/app/payment/[status]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePayment } from '@/hooks/usePayment';
import { PaymentResponse } from '@/types/payment';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function PaymentStatusPage({ params }: { params: { status: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyPayment } = usePayment();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);

  const sessionId = searchParams?.get('session_id');
  const isCancel = params.status === 'cancel';

  useEffect(() => {
    const verifySession = async () => {
      // If this is a cancellation, don't verify payment
      if (isCancel) {
        setLoading(false);
        return;
      }

      if (!sessionId) {
        setError('Please contact support for assistance');
        setLoading(false);
        return;
      }

      try {
        const response = await verifyPayment(sessionId);
        console.log('Payment verification response:', response);
        setPayment(response);
      } catch (err: any) {
        console.error('Payment verification error:', err);
        setError(err.message || 'Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId, verifyPayment, isCancel]);

  const handleContinue = () => {
    router.push('/documents');
  };

  const handleReturnToSettings = () => {
    router.push('/settings');
  };

  const isSuccess = payment?.status === 'successful' || 
                   payment?.payment_metadata?.verification_data?.status === 'complete' ||
                   payment?.payment_metadata?.verification_data?.payment_status === 'paid';

  if (loading && !isCancel) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
            <h2 className="text-xl font-semibold">Verifying your payment...</h2>
            <p className="text-sm text-gray-500">Please wait while we confirm your transaction.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (isCancel) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-gray-500" />
            <h2 className="text-xl font-semibold">Payment Cancelled</h2>
            <p className="text-sm text-gray-500">
              Your payment process has been cancelled. You can try again or contact support if you need assistance.
            </p>
            <Button onClick={handleReturnToSettings}>Return to Settings</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold">Payment Verification Failed</h2>
            <p className="text-sm text-gray-500">{error}</p>
            <Button onClick={handleReturnToSettings}>Return to Settings</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          {isSuccess ? (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h2 className="text-xl font-semibold">Payment Successful!</h2>
              <p className="text-sm text-gray-500">
                Your payment has been processed successfully. You can now start using your plan.
              </p>
              <div className="mt-2 text-xs text-gray-400">
                Transaction ID: {payment?.id}
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-semibold">Payment Failed</h2>
              <p className="text-sm text-gray-500">
                Something went wrong with your payment. Please try again or contact support if the problem persists.
              </p>
              {payment && (
                <div className="mt-2 text-xs text-gray-400">
                  Status: {payment.status}
                </div>
              )}
            </>
          )}
          <div className="flex gap-4">
            {isSuccess ? (
              <Button onClick={handleContinue}>Continue to Documents</Button>
            ) : (
              <Button onClick={handleReturnToSettings}>Return to Settings</Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}