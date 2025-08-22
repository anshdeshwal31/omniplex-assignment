import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export const config = {
  currency: 'usd',
  payment_method_types: ['card'],
};

export const products = {
  pro: {
    name: 'Pro Plan',
    description: 'Unlock all premium features',
    price: 1000, // $10.00 in cents
    currency: 'usd',
  },
};
