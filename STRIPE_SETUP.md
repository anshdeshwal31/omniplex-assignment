# Stripe Integration Setup

This project includes a complete Stripe payment integration with test mode support.

## Setup Instructions

### 1. Create a Stripe Account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Sign up for a free Stripe account
3. Complete the account verification process

### 2. Get Your API Keys

1. In your Stripe Dashboard, go to **Developers** > **API keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### 3. Configure Environment Variables

Update your `.env.local` file with your Stripe keys:

```bash
# Replace with your actual Stripe test keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 4. Test Payment

The integration includes a test product "Pro Plan" for $10. You can test payments using Stripe's test card numbers:

**Successful Payment:**

- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined Payment:**

- Card Number: `4000 0000 0000 0002`

### 5. Access the Features

1. **Pricing Page:** Navigate to `/pricing` or click the "Upgrade to Pro" button
2. **Test Purchase:** Click "Get Pro Plan" and use the test card details above
3. **Payment Result:** After payment, you'll be redirected to a success/failure page

## Features Included

- ✅ Stripe Checkout integration
- ✅ Test product ($10 Pro Plan)
- ✅ Payment success/failure handling
- ✅ Embedded checkout UI
- ✅ Webhook support for payment events
- ✅ Responsive design
- ✅ Error handling

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   ├── route.ts          # Create checkout session
│   │   │   └── session/
│   │   │       └── route.ts      # Retrieve session status
│   │   └── webhooks/
│   │       └── route.ts          # Handle Stripe webhooks
│   ├── pricing/
│   │   └── page.tsx              # Pricing page
│   └── payment-result/
│       └── page.tsx              # Payment result page
├── components/
│   ├── Pricing/
│   │   ├── Pricing.tsx           # Main pricing component
│   │   └── Pricing.module.css    # Pricing styles
│   └── PricingButton/
│       ├── PricingButton.tsx     # Upgrade button
│       └── PricingButton.module.css
└── utils/
    ├── stripe.ts                 # Client-side Stripe config
    └── stripe-server.ts          # Server-side Stripe config
```

## Webhook Setup (Optional)

To receive real-time payment updates:

1. Install Stripe CLI: `npm install -g stripe`
2. Login: `stripe login`
3. Forward events: `stripe listen --forward-to localhost:3000/api/webhooks`
4. Copy the webhook signing secret to your `.env.local`

## Production Deployment

1. Replace test keys with live keys in production
2. Set up webhook endpoints in Stripe Dashboard
3. Update the return URL in the checkout session creation
4. Implement proper user authentication and subscription management

## Support

For Stripe-related issues, check:

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
