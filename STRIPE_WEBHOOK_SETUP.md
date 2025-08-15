# Stripe Webhook Setup Guide

This guide explains how to set up and configure the Stripe webhook endpoint for your art commission platform.

## Webhook Endpoint

The webhook endpoint is located at: `/api/webhooks/stripe`

## Environment Variables

Add these environment variables to your `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Your webhook endpoint secret
```

## Setting Up the Webhook in Stripe Dashboard

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set the endpoint URL:
   - **Development**: `http://localhost:3000/api/webhooks/stripe`
   - **Production**: `https://yourdomain.com/api/webhooks/stripe`
4. Select the events you want to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `account.updated`
   - `payout.paid`
   - `payout.failed`
5. Click "Add endpoint"
6. Copy the webhook signing secret and add it to your environment variables

## Features

### ✅ POST Request Handling
The endpoint accepts POST requests with JSON payloads containing Stripe event objects.

### ✅ Organization Event Support
For organization events, the endpoint inspects the event data to determine which account generated the event. You can add organization-specific logic in the handler.

### ✅ Quick Response
The endpoint returns a 200 status code immediately before processing complex logic to prevent timeouts.

### ✅ Signature Verification
All webhook requests are verified using Stripe's signature verification to ensure they come from Stripe.

### ✅ Error Handling
Comprehensive error handling for signature verification failures and event processing errors.

## Event Handlers

The webhook includes handlers for common Stripe events:

- **Payment Events**: `payment_intent.succeeded`, `payment_intent.payment_failed`
- **Checkout Events**: `checkout.session.completed`
- **Invoice Events**: `invoice.payment_succeeded`, `invoice.payment_failed`
- **Subscription Events**: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- **Account Events**: `account.updated`
- **Payout Events**: `payout.paid`, `payout.failed`

## Customizing Event Handlers

Edit the handler functions in `src/app/api/webhooks/stripe/route.ts` to implement your business logic:

```typescript
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
  // Add your business logic here:
  // - Update commission status in database
  // - Send confirmation emails
  // - Update inventory
  // - etc.
}
```

## Testing the Webhook

### Using Stripe CLI (Recommended)

1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. The CLI will provide a webhook signing secret to use in development

### Using Stripe Dashboard

1. Go to the webhook endpoint in your Stripe Dashboard
2. Click "Send test webhook"
3. Select an event type and click "Send test webhook"

## Security Considerations

- **Always verify webhook signatures** (already implemented)
- **Use HTTPS in production** (required by Stripe)
- **Keep your webhook secret secure** (use environment variables)
- **Handle idempotency** (same event might be sent multiple times)

## Production Deployment

When deploying to production:

1. Update the webhook endpoint URL in Stripe Dashboard to your production domain
2. Ensure your domain uses HTTPS
3. Set up proper environment variables in your hosting platform
4. Monitor webhook delivery in the Stripe Dashboard

## Monitoring

Monitor webhook delivery in the Stripe Dashboard:
- Go to Webhooks in your Stripe Dashboard
- Click on your endpoint
- View the "Events" tab to see delivery status and logs

## Troubleshooting

### Common Issues

1. **Signature verification failed**: Check that your `STRIPE_WEBHOOK_SECRET` is correct
2. **404 errors**: Ensure the endpoint URL is correct and the route is properly configured
3. **Timeout errors**: The endpoint returns 200 quickly, but check your event processing logic
4. **Missing events**: Verify you've selected the correct events in the Stripe Dashboard

### Debugging

Add logging to your event handlers to debug issues:

```typescript
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment intent:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    status: paymentIntent.status,
    metadata: paymentIntent.metadata
  });
  // Your business logic here
}
``` 