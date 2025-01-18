"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePayment } from '@/hooks/usePayment';
import type { PaymentResponse } from '@/types/payment';

export default function PaymentResult() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { getPaymentDetails, isLoading } = usePayment();
  const [payment, setPayment] = useState<PaymentResponse | null>(null);

  useEffect(() => {
    const txRef = searchParams.get('tx_ref');
    if (txRef) {
      loadPaymentDetails(txRef);
    }
  }, [searchParams]);

  const loadPaymentDetails = async (txRef: string) => {
    try {
      const details = await getPaymentDetails(txRef);
      setPayment(details);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load payment details"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isSuccess = pathname?.includes('successful');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-6">
          <div className="text-center">
            {isSuccess ? (
              <div className="mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold mt-4">Payment Successful!</h2>
                <p className="text-gray-600 mt-2">Your subscription has been activated</p>
              </div>
            ) : (
              <div className="mb-6">
                <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-bold mt-4">Payment Failed</h2>
                <p className="text-gray-600 mt-2">Please try again</p>
              </div>
            )}

            {payment && (
              <div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Reference</span>
                  <span className="font-mono text-sm">{payment.tx_ref}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Date</span>
                  <span>
                    {new Date(payment.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-4 p-6">
          {isSuccess ? (
            <Button 
              onClick={() => router.push('/dashboard')}
              className="min-w-[200px]"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => router.push('/settings')}
                className="min-w-[120px]"
              >
                Try Again
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                className="min-w-[120px]"
              >
                Dashboard
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}