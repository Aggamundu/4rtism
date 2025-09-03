'use client'
import { useEffect, useState } from "react";
import { supabaseClient } from "../../../../utils/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

export default function Stripe() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const [isComplete, setIsComplete] = useState(false);

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
    if (!error) {
      setConnectedAccountId(data?.stripe_account_id);
    } else {
      console.error('Error getting stripe account id:', error);
    }
  }

  //Check if profile has stripe account id
  const checkIsComplete = async () => {
    const { data, error } = await supabaseClient.from("profiles").select("added_stripe_information").eq("id", user?.id).single();
    // if (error) {
    //   console.error('Error checking stripe information:', error);
    // }
    if (data?.added_stripe_information) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }

  useEffect(() => {
    getStripeAccountId();
    checkIsComplete();
  }, [user]);

  return (
    <div className="bg-custom-offwhite min-h-screen overflow-y-auto w-[100%] float-right text-black px-[5%] py-[.5%] rounded-[30px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2">
        <div className="text-xl sm:mr-[4%]">
          Stripe
        </div>
        {isComplete && (<div className="bg-custom-green text-white text-sm w-fit px-4 py-[.5%] rounded-card">
          Account Linked
        </div>)}
        {!isComplete && (<div className="bg-red-500 text-white text-sm w-fit px-4 py-[.5%] rounded-card">
          Create Account/Add Information
        </div>)}
      </div>
      <div className="flex flex-col gap-y-2">
        {!connectedAccountId && !accountCreatePending && (<>
          <div>You must create a stripe account to create services and receive payments.</div>
          <button className="bg-black w-fit px-4 text-white text-sm hover:bg-black/80 active:scale-95 rounded-card h-[30px] py-[.5%]"
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
            Create Stripe Account
          </button>
        </>
        )}
        {accountCreatePending && (<div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-green mx-auto mb-4"></div>
            <p className="text-gray-600">Creating account please wait...</p>
          </div>
        </div>
        )}
        {accountLinkCreatePending && (<div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-green mx-auto mb-4"></div>
            <p className="text-gray-600">Creating account link please wait...</p>
          </div>
        </div>
        )}
        {connectedAccountId && !accountLinkCreatePending && (
          <>
            {!isComplete && <div>Nice! Now complete your account by adding your information</div>}
            <button className="bg-black w-fit px-4 text-white text-sm hover:bg-black/80 active:scale-95 rounded-card h-[30px] py-[.5%]"
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
              {isComplete ? "Edit your information" : "Add your information"}
            </button>
          </>
        )}
        {isComplete && (
          <div>
            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer"
              className="bg-black w-fit px-4 text-white text-sm hover:bg-black/80 active:scale-95 rounded-card h-[30px] py-[.5%]">
              Go to Stripe Dashboard
            </a>
          </div>
        )}
      </div>

    </div>
  );
} 