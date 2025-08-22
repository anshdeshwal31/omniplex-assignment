'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import styles from './Pricing.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  clientSecret: string;
}

function CheckoutForm({ clientSecret }: CheckoutFormProps) {
  return (
    <div className={styles.checkoutContainer}>
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

export default function Pricing() {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handlePurchase = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productKey: 'pro',
          userId: 'user_123', // Replace with actual user ID if available
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (clientSecret) {
    return <CheckoutForm clientSecret={clientSecret} />;
  }

  return (
    <div className={styles.pricingContainer}>
      <div className={styles.pricingCard}>
        <div className={styles.pricingHeader}>
          <h2>Pro Plan</h2>
          <p>Unlock all premium features</p>
        </div>
        
        <div className={styles.price}>
          <span className={styles.priceCurrency}>$</span>10
        </div>
        
        <ul className={styles.features}>
          <li>Unlimited AI conversations</li>
          <li>Priority support</li>
          <li>Advanced search features</li>
          <li>Export chat history</li>
          <li>Custom integrations</li>
        </ul>
        
        <button
          className={styles.checkoutButton}
          onClick={handlePurchase}
          disabled={isLoading}
        >
          {isLoading && <span className={styles.loading}></span>}
          {isLoading ? 'Processing...' : 'Get Pro Plan'}
        </button>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#718096' }}>
          Test card: 4242 4242 4242 4242
        </p>
      </div>
    </div>
  );
}
