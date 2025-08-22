import { NextRequest, NextResponse } from 'next/server';
import { stripe, products } from '@/utils/stripe-server';

export async function POST(req: NextRequest) {
  try {
    const { productKey, userId } = await req.json();

    if (!products[productKey as keyof typeof products]) {
      return NextResponse.json(
        { error: 'Invalid product' },
        { status: 400 }
      );
    }

    const product = products[productKey as keyof typeof products];

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${req.headers.get('origin')}/payment-result?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: userId || 'anonymous',
        productKey,
      },
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
