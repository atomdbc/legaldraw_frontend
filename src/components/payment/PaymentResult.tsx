"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, Settings, ArrowRight, RefreshCw } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg text-gray-600">Processing payment...</p>
        </div>
      </div>
    );
  }

  const isSuccess = pathname?.includes('successful');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-t-4 transition-all duration-300 ease-in-out hover:shadow-xl">
          <CardHeader className={`text-center border-b pb-6 ${
            isSuccess ? 'border-green-100' : 'border-red-100'
          }`}>
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <div className="bg-green-50 rounded-full p-3">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
              ) : (
                <div className="bg-red-50 rounded-full p-3">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-bold mb-2">
              {isSuccess ? "Payment Successful!" : "Payment Failed"}
            </CardTitle>
            <p className="text-gray-600 text-lg">
              {isSuccess 
                ? "Your subscription has been activated successfully" 
                : "We couldn't process your payment at this time"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {payment && (
              <div className="bg-white rounded-xl p-6 border shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="text-2xl font-bold text-primary">
                    {payment.currency} {payment.amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Transaction ID</span>
                  <code className="bg-gray-50 px-3 py-1 rounded-md text-sm font-mono">
                    {payment.tx_ref}
                  </code>
                </div>
                
                <div className="flex justify-between items-center py-3 border-t">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {new Date(payment.created_at).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-t">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold ${
                    isSuccess ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isSuccess ? 'Payment Completed' : 'Payment Failed'}
                  </span>
                </div>
              </div>
            )}

            {isSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800 text-center py-2">
                  Your subscription is now active. Visit settings to manage your plan.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 p-6 pt-2">
            {isSuccess ? (
              <Button 
                onClick={() => router.push('/settings')}
                className="w-full sm:w-auto min-w-[200px] text-lg h-12"
              >
                <Settings className="w-5 h-5 mr-2" />
                Manage Subscription
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push('/settings')}
                  className="w-full sm:w-auto text-lg h-12"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={() => router.push('/settings')}
                  className="w-full sm:w-auto text-lg h-12"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Go to Settings
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        {payment && isSuccess && (
          <div className="text-center mt-6 text-gray-500">
            A confirmation email has been sent to your registered email address
          </div>
        )}
      </div>
    </div>
  );
}