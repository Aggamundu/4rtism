import { NextRequest, NextResponse } from "next/server";
import stripe from "../../../../utils/stripe";

export async function POST(request: NextRequest) {
  try {
    const account = await stripe.accounts.create({
      controller: {
        stripe_dashboard: {
          type: "express",
        },
        fees: {
          payer: "application"
        },
        losses: {
          payments: "application"
        },
      },
    });

    return NextResponse.json({account: account.id});
  } catch (error) {
    console.error('An error occurred when calling the Stripe API to create an account:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}