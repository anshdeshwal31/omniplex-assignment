import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe-server';

export async function GET(req: NextRequest) {
  try {
    // Early return if Stripe is not initialized
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 501 }
      );
    }

    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
      payment_status: session.payment_status,
    });
  } catch (err: any) {
    console.error('Error retrieving checkout session:', err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
