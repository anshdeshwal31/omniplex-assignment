'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface PaymentStatus {
  status: string;
  customer_email?: string;
  payment_status: string;
}

export default function PaymentResultPage() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPaymentStatus(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching payment status:', err);
        setError('Failed to fetch payment status');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/pricing"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  const isSuccessful = paymentStatus?.payment_status === 'paid';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isSuccessful ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isSuccessful ? (
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        <h1 className={`text-2xl font-bold mb-2 ${
          isSuccessful ? 'text-green-900' : 'text-red-900'
        }`}>
          {isSuccessful ? 'Payment Successful!' : 'Payment Failed'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {isSuccessful 
            ? `Thank you for your purchase! ${paymentStatus.customer_email ? `A confirmation email has been sent to ${paymentStatus.customer_email}.` : ''}`
            : 'There was an issue processing your payment. Please try again.'
          }
        </p>
        
        <div className="space-y-3">
          {isSuccessful ? (
            <>
              <Link
                href="/"
                className="block w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Continue to Dashboard
              </Link>
              <Link
                href="/pricing"
                className="block w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                View Pricing
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/pricing"
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </Link>
              <Link
                href="/"
                className="block w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Home
              </Link>
            </>
          )}
        </div>
        
        {paymentStatus && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md text-left">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Details:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Status:</strong> {paymentStatus.status}</p>
              <p><strong>Payment Status:</strong> {paymentStatus.payment_status}</p>
              {paymentStatus.customer_email && (
                <p><strong>Email:</strong> {paymentStatus.customer_email}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
