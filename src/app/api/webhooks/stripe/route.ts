import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature!, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle organization events by inspecting the context
  // Note: Organization context is available in newer Stripe API versions
  // For now, we'll handle it through the event data structure
  if (event.data && event.data.object) {
    const eventObject = event.data.object as any;
    if (eventObject.account) {
      console.log('Organization event for account:', eventObject.account);
      // You can add organization-specific logic here
      // For example, route to different handlers based on the account
    }
  }

  // Return 200 immediately to prevent timeout
  const response = NextResponse.json({ received: true }, { status: 200 });

  // Process the event asynchronously after returning the response
  processWebhookEvent(event).catch((error) => {
    console.error('Error processing webhook event:', error);
  });

  return response;
}

async function processWebhookEvent(event: Stripe.Event) {
  console.log('Processing webhook event:', event.type);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;
      
      case 'payout.paid':
        await handlePayoutPaid(event.data.object as Stripe.Payout);
        break;
      
      case 'payout.failed':
        await handlePayoutFailed(event.data.object as Stripe.Payout);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`Error handling ${event.type}:`, error);
    throw error;
  }
}

// Event handlers - implement your business logic here
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  // Update your database to mark the payment as successful
  // Update commission status, etc.
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
  // Update your database to mark the payment as failed
  // Notify the user, etc.
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  // Process the completed checkout
  // Update commission status, send confirmation emails, etc.
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  // Handle successful invoice payment
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);
  // Handle failed invoice payment
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  // Handle new subscription
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  // Handle subscription updates
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  // Handle subscription cancellation
}

async function handleAccountUpdated(account: Stripe.Account) {
  console.log('Account updated:', account.id);
  // Handle account updates (useful for Connect accounts)
}

async function handlePayoutPaid(payout: Stripe.Payout) {
  console.log('Payout paid:', payout.id);
  // Handle successful payout to connected accounts
}

async function handlePayoutFailed(payout: Stripe.Payout) {
  console.log('Payout failed:', payout.id);
  // Handle failed payout
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 