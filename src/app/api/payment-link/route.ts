import { NextRequest, NextResponse } from "next/server";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const { amount, description, metadata, stripeAccount } = await req.json();
    console.log("stripeAccount", stripeAccount)
    
    // Check if the connected account has card_payments enabled
    try {
      const account = await stripe.accounts.retrieve(stripeAccount);
      if (!account.capabilities?.card_payments || account.capabilities.card_payments !== 'active') {
        return NextResponse.json({ 
          error: "Connected account does not have card payments enabled. Please complete the Stripe onboarding process." 
        }, { status: 400 });
      }
    } catch (accountError) {
      console.error('Error checking account capabilities:', accountError);
      return NextResponse.json({ 
        error: "Unable to verify connected account capabilities" 
      }, { status: 400 });
    }
    
    const product = await stripe.products.create({
      name: "Commission Payment",
      description: "Payment for a commission",
      metadata: {
        ...metadata,
      },
    }, {
      stripeAccount: stripeAccount,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount * 100,
      currency: "usd",
    }, {
      stripeAccount: stripeAccount,
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{
         price: price.id,
          quantity: 1 
        }
      ],
    }, 
    {
      stripeAccount: stripeAccount,
    })
    console.log(paymentLink);

    return NextResponse.json({ paymentLink: paymentLink.url });
      
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}