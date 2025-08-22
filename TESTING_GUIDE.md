# Testing the Stripe Integration

## Quick Test Guide

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Navigate to the pricing page:**

   - Open http://localhost:3000 in your browser
   - Click the "Upgrade to Pro" button in the top-right corner
   - Or go directly to http://localhost:3000/pricing

3. **Test with Stripe test card:**

   - Click "Get Pro Plan" button
   - In the Stripe checkout form, use these test details:
     - **Card Number:** `4242 4242 4242 4242`
     - **Expiry:** `12/34` (any future date)
     - **CVC:** `123` (any 3 digits)
     - **ZIP:** `12345` (any 5 digits)
     - **Email:** Any email address

4. **Complete the payment:**
   - Click "Pay now"
   - You should be redirected to a success page
   - Check the payment details displayed

## Important Notes

⚠️ **Before testing, you MUST:**

1. Replace the placeholder Stripe keys in `.env.local` with your actual test keys from https://dashboard.stripe.com/test/apikeys:

   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   STRIPE_SECRET_KEY=sk_test_your_actual_key_here
   ```

2. The current keys in the `.env.local` are placeholders and won't work!

## Test Scenarios

### Successful Payment

- Use card: `4242 4242 4242 4242`
- Should redirect to success page with green checkmark

### Failed Payment

- Use card: `4000 0000 0000 0002`
- Should show payment declined message

### Incomplete Payment

- Close the checkout window before completing
- Should return to pricing page

## What's Implemented

✅ Complete Stripe Checkout integration
✅ Product: "Pro Plan - $10"
✅ Test card support (4242 4242 4242 4242)
✅ Success/failure payment flow
✅ Responsive design
✅ Error handling
✅ Payment status checking
✅ Webhook support (for production)

The integration is ready for testing once you add your actual Stripe test keys!
