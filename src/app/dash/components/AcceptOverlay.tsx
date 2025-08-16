import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { supabaseClient } from "../../../../utils/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import { AnswerDisplay, CommissionRequest } from "../../types/Types";
import ImageDisplay from "./ImageDisplay";
import ServiceDisplay from "./ServiceDisplay";
import TextDisplay from "./TextDisplay";

interface AcceptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  commission?: CommissionRequest;
}

export default function AcceptOverlay({ isOpen, onClose, commission }: AcceptOverlayProps) {
  if (!isOpen || !commission) return null;

  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  const [showInvoiceOverlay, setShowInvoiceOverlay] = useState(false);
  const [invoicePrice, setInvoicePrice] = useState("");
  const [message, setMessage] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [artistEmail, setArtistEmail] = useState("");
  const [artistName, setArtistName] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  const { user } = useAuth();

  const getStripeAccountId = async () => {
    const { data, error } = await supabaseClient.from("profiles").select("stripe_account_id").eq("id", user?.id).single();
    if (error) {
      console.error(error);
    }
    return data?.stripe_account_id;
  }
  const getArtistName = async (userId: string) => {
    const { data, error } = await supabaseClient.from("profiles").select("user_name").eq("id", userId).single();
    if (error) {
      console.error(error);
    }
    setArtistName(data?.user_name || "");
  }

  const getClientEmail = async (response_id: number) => {
    const { data, error } = await supabaseClient.from("emails").select("email").eq("response_id", response_id).single();
    if (error) {
      console.error(error);
    }
    setClientEmail(data?.email || "");
  }


  const sendEmail = async (paymentLink: string) => {
    const emailHTML = `
      <div style="min-height: 100vh; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center; padding: 1rem;">
        <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); padding: 2rem; max-width: 28rem; width: 100%; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 2rem;">
            <h1 style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">Payment Request</h1>
            <p style="color: #4b5563; margin-top: 0.5rem;">from ${artistName}</p>
          </div>

          <div style="background-color: #f9fafb; padding: 1rem; border-radius: 0.375rem; margin-bottom: 1.5rem;">
            <p style="font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">Message from the Artist:</p>
            <div style="background-color: white; padding: 1rem; border-radius: 0.375rem; border: 1px solid #e5e7eb;">
              <p style="color: #1f2937; font-style: italic;">
                ${message}
              </p>
            </div>
          </div>

          <div style="margin-bottom: 2rem;">
            <div style="background-color: #f9fafb; padding: 1rem; border-radius: 0.375rem; margin-bottom: 1rem;">
              <p style="font-size: 0.875rem; color: #4b5563;">Commission Title</p>
              <p style="font-size: 1.125rem; font-weight: 500; color: #111827;">${commission.commission_title}</p>
            </div>

            <div style="background-color: #f9fafb; padding: 1rem; border-radius: 0.375rem;">
              <p style="font-size: 0.875rem; color: #4b5563;">Amount Due</p>
              <p style="font-size: 1.125rem; font-weight: 500; color: #111827;">$${invoicePrice}</p>
            </div>
          </div>

          <div style="margin: 0 -0.5rem;">
            <a 
              href="${paymentLink}"
              style="display: block; width: 100%; background-color: #2563eb; color: white; text-align: center; padding: 1rem 1.5rem; border-radius: 0.375rem; text-decoration: none; font-size: 1.125rem; font-weight: 500; box-sizing: border-box;"
            >
              Pay Now →
            </a>
          </div>

          <div style="margin-top: 1.5rem; text-align: center;">
            <p style="font-size: 0.875rem; color: #6b7280;">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    `;

    const text = `
Payment Request
from ${artistName}

Message from the Artist:
${message}

Commission Title: ${commission.commission_title}
Amount Due: $${invoicePrice}

To complete your payment, please visit: ${paymentLink}

Secure payment powered by Stripe
    `;

    const response = await fetch('/api/mail', {
      method: 'POST',
      body: JSON.stringify({
        to: clientEmail,
        subject: commission.commission_title,
        text: text,
        html: emailHTML,
      }),
    });
  }

  const createPaymentLink = async () => {
    try {
      const response = await fetch('/api/payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(invoicePrice),
          description: commission.commission_title,
          stripeAccount: await getStripeAccountId(),
          metadata: {
            responseId: commission.response_id,
          },
        })
      })
      const data = await response.json();

      if (data.paymentLink) {
        setPaymentLink(data.paymentLink);
        await sendEmail(data.paymentLink);
        toast.success("Invoice sent");

      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
      toast.error('Error creating payment link');
    }
  }

  const handlePaymentLink = async () => {
    setShowInvoiceOverlay(false);
    setInvoicePrice("");
    toast.success("Invoice sent");
    // onClose();
    await createPaymentLink();
  }

  const renderAnswer = (answer: AnswerDisplay, index: number) => {
    switch (answer.type) {
      case "short-answer":
        return <TextDisplay key={index} title={answer.question_text} value={answer.answer_text || "N/A"} />
      case "paragraph":
        return (<div key={index} className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">
          <label className="text-black text-sm mb-2 font-bold">{answer.question_text}</label>
          <p className="text-black text-sm">{answer.answer_text || "N/A"}</p>
        </div>)
      case "multiple-choice":
        return (
          <div key={index} className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">
            <label className="text-black text-sm mb-2 font-bold">{answer.question_text}</label>
            <div className="flex items-center gap-x-2">
              <div className="w-4 h-4 rounded-full bg-custom-accent"></div>
              <p className="text-black text-sm">{answer.selected_option || "N/A"}</p>
            </div>
          </div>
        )
      case "checkboxes":
        return (
          <div key={index} className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">
            <label className="text-black text-sm mb-2 font-bold">{answer.question_text}</label>
            <div className="flex flex-col gap-y-2">
              {answer.selected_options?.map((option, index) => (
                <div key={index} className="flex items-center gap-x-2">
                  <div className="w-4 h-4 bg-custom-accent"></div>
                  <p className="text-black text-sm">{option}</p>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }

  useEffect(() => {
    setArtistEmail(user.email);
    getClientEmail(commission.response_id);
    getArtistName(user.id);
  }, [user, commission]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-custom-offwhite rounded-card h-screen w-full flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-custom-offwhite border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="text-lg font-bold flex-1 text-center">Request</div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col p-6 justify-center items-center gap-y-4">
            <ServiceDisplay image_urls={commission.service.image_urls} title={commission.service.title} price={commission.service.price} />
            <TextDisplay title="Name" value={commission.client} />
            <div className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">
              <label className="text-black text-sm mb-2 font-bold">Contact Information</label>
              <div className="flex flex-col gap-y-2">
                <div className="flex">
                  <span className="text-black text-sm mr-2">Instagram: </span>
                  <span className="text-black text-sm flex-1 border-b border-custom-lightgray">{commission.instagram ? commission.instagram : ""}</span>
                </div>
                <div className="flex">
                  <span className="text-black text-sm mr-2">Discord: </span>
                  <span className="text-black text-sm flex-1 border-b border-custom-lightgray">{commission.discord ? commission.discord : ""}</span>
                </div>
                <div className="flex">
                  <span className="text-black text-sm mr-2">Twitter: </span>
                  <span className="text-black text-sm flex-1 border-b border-custom-lightgray">{commission.twitter ? commission.twitter : ""}</span>
                </div>
              </div>
            </div>
            {commission.description && (
              <div className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">
                <label className="text-black text-sm mb-2 font-bold">Description</label>
                <p className="text-black text-sm">{commission.description}</p>
              </div>)}
            {commission.reference_image_urls && commission.reference_image_urls.length > 0 && (
              <ImageDisplay images={commission.reference_image_urls} title="Reference Images" />
            )}
            {commission.answers.map((answer, index) => renderAnswer(answer, index))}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-custom-offwhite border-t border-gray-200 px-6 py-4 flex flex-row justify-center gap-x-4">
          <button
            onClick={() => setShowRejectConfirmation(true)}
            className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold py-2 px-8 rounded-full"
          >
            Reject
          </button>
          <button
            onClick={() => setShowInvoiceOverlay(true)}
            className="bg-custom-green hover:bg-custom-green/90 active:scale-95 text-white font-bold py-2 px-8 rounded-full"
          >
            Accept
          </button>
        </div>
      </div>

      {/* Reject Confirmation Overlay */}
      {showRejectConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Rejection</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to reject this commission request? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle reject logic here
                  setShowRejectConfirmation(false);
                  onClose();
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Overlay */}
      {showInvoiceOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Send Payment</h3>
            <p className="text-gray-700 mb-4">
              Enter the price for this commission to send an invoice to the client.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($USD)
              </label>
              <input
                type="number"
                value={invoicePrice}
                onChange={(e) => setInvoicePrice(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-transparent"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send a message to your client
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-green focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowInvoiceOverlay(false);
                  setInvoicePrice("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentLink}
                disabled={!invoicePrice || parseFloat(invoicePrice) <= 0}
                className="bg-custom-green hover:bg-custom-green/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
              >
                Send Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}