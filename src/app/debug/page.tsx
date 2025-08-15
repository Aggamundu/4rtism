'use client'
import { useState } from "react";
import { supabaseClient } from "../../../utils/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const { user } = useAuth();
  const saveStripeAccountId = async (accountId: string) => {
    const { data, error } = await supabaseClient.from("profiles").update({ stripe_account_id: accountId }).eq("id", user?.id);
    if (error) {
      console.error(error);
    }
    console.log(data);
  }

  const getStripeAccountId = async () => {
    const { data, error } = await supabaseClient.from("profiles").select("stripe_account_id").eq("id", user?.id).single();
    if (error) {
      console.error(error);
    }
    return data?.stripe_account_id;
  }

  return (
    <div className="container">
      <div className="banner">
        <h2>4rtism</h2>
      </div>
      <div className="content">
        {!connectedAccountId && <h2>Get ready for take off</h2>}
        {!connectedAccountId && <p>4rtism is the world's leading air travel platform: join our team of pilots to help people travel faster.</p>}
        {connectedAccountId && <h2>Add information to start accepting money</h2>}
        {connectedAccountId && <p>Matt's Mats partners with Stripe to help you receive payments while keeping your personal and bank details secure.</p>}
        {!accountCreatePending && !connectedAccountId && (
          <button className="bg-custom-accent hover:bg-custom-accent/90 active:scale-95 text-white font-bold py-2 px-8 rounded-full"
            onClick={async () => {
              setAccountCreatePending(true);
              setError(false);
              fetch("/api/account", {
                method: "POST",
              })
                .then((response) => response.json())
                .then((json) => {
                  setAccountCreatePending(false);

                  const { account, error } = json;

                  if (account) {
                    setConnectedAccountId(account);
                    saveStripeAccountId(account);
                  }

                  if (error) {
                    setError(true);
                  }
                });
            }}
          >
            Create an account!
          </button>
        )}
        {connectedAccountId && !accountLinkCreatePending && (
          <button className="bg-custom-accent hover:bg-custom-accent/90 active:scale-95 text-white font-bold py-2 px-8 rounded-full"
            onClick={async () => {
              setAccountLinkCreatePending(true);
              setError(false);
              fetch("/api/account_link", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  account: connectedAccountId,
                }),
              })
                .then((response) => response.json())
                .then((json) => {
                  setAccountLinkCreatePending(false);

                  const { url, error } = json;
                  if (url) {
                    window.location.href = url;
                  }

                  if (error) {
                    setError(true);
                  }
                });
            }}
          >
            Add information
          </button>
        )}
        {error && <p className="error">Something went wrong!</p>}
        {(connectedAccountId || accountCreatePending || accountLinkCreatePending) && (
          <div className="dev-callout">
            {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
          </div>
        )}
        <div className="info-callout">
          <p>
            This is a sample app for Stripe-hosted Connect onboarding. <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=hosted" target="_blank" rel="noopener noreferrer">View docs</a>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (USD)</label>
            <input
              type="number"
              id="amount"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-accent focus:border-custom-accent text-black bg-white"
              placeholder="50"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              id="description"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-accent focus:border-custom-accent text-black bg-white"
              placeholder="Commission payment"
            />
          </div>
          <div>
            <label htmlFor="commissionId" className="block text-sm font-medium text-gray-700">Commission ID</label>
            <input
              type="text"
              id="commissionId"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-accent focus:border-custom-accent text-black bg-white"
              placeholder="comm_123"
            />
          </div>
          <div>
            <label htmlFor="artistName" className="block text-sm font-medium text-gray-700">Artist Name</label>
            <input
              type="text"
              id="artistName"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-accent focus:border-custom-accent text-black bg-white"
              placeholder="artist_username"
            />
          </div>
          <button
            className="bg-custom-accent hover:bg-custom-accent/90 active:scale-95 text-white font-bold py-2 px-8 rounded-full"
            onClick={async () => {
              const amount = (document.getElementById('amount') as HTMLInputElement).value;
              const description = (document.getElementById('description') as HTMLInputElement).value;
              const commissionId = (document.getElementById('commissionId') as HTMLInputElement).value;
              const artistName = (document.getElementById('artistName') as HTMLInputElement).value;

              if (!amount || !description || !commissionId) {
                alert('Please fill in all fields');
                return;
              }

              try {
                const response = await fetch('/api/payment-link', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    amount: parseFloat(amount),
                    description,
                    stripeAccount: await getStripeAccountId(),
                    metadata: {
                      commissionId: commissionId,
                    },
                  }),
                });

                const data = await response.json();

                if (data.paymentLink) {
                  alert(`Payment link created: ${data.paymentLink}`);
                  window.open(data.paymentLink, '_blank');
                } else if (data.error) {
                  alert(`Error: ${data.error}`);
                }
              } catch (error) {
                console.error('Error creating payment link:', error);
                alert('Error creating payment link');
              }
            }}
          >
            Create payment link
          </button>
        </div>
      </div>
    </div>
  );
}