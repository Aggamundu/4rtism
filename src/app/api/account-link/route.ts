import { NextRequest, NextResponse } from "next/server";
import stripe from "../../../../utils/stripe";

export async function POST(req: NextRequest) {
    try {
      const { account } = await req.json();

      const accountLink = await stripe.accountLinks.create({
        account: account,
        refresh_url: `${req.headers.get('origin')}/refresh/${account}`,
        return_url: `${req.headers.get('origin')}/return/${account}`,
        type: "account_onboarding",
      });

      return NextResponse.json({
        url: accountLink.url,
      });
    } catch (error) {
      console.error(
        "An error occurred when calling the Stripe API to create an account link:",
        error
      );
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return NextResponse.json({ error: errorMessage}, { status: 500 });
    }
  }
