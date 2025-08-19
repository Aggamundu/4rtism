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
  onRefresh?: () => void;
}

export default function AcceptOverlay({ isOpen, onClose, commission, onRefresh }: AcceptOverlayProps) {
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

  const updateResponse = async (responseId: number, status: string) => {
    const { data, error } = await supabaseClient.from("responses").update({ status: status }).eq("id", responseId);
    if (error) {
      console.error(error);
    }
  }

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
      <div style="background-color: #f3f4f6; padding: 0.75rem; font-family: 'Lexend', sans-serif;">
        <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 1.25rem; max-width: 28rem; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 1.25rem;">
            <h1 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin: 0; font-family: 'Lexend', sans-serif;">Payment Request</h1>
            <p style="color: #4b5563; margin: 0.25rem 0 0 0; font-size: 0.875rem; font-family: 'Lexend', sans-serif;">from ${artistName}</p>
          </div>

          ${message ? `
          <div style="background-color: #f9fafb; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 1.25rem;">
            <p style="font-size: 0.75rem; font-weight: 500; color: #374151; margin: 0 0 0.25rem 0; font-family: 'Lexend', sans-serif;">Message:</p>
            <div style="background-color: white; padding: 0.75rem; border-radius: 0.375rem; border: 1px solid #e5e7eb;">
              <p style="color: #1f2937; font-style: italic; margin: 0; font-size: 0.875rem; font-family: 'Lexend', sans-serif;">
                ${message}
              </p>
            </div>
          </div>
          ` : ''}

          <div style="margin-bottom: 1.25rem;">
            <div style="background-color: #f9fafb; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 0.75rem;">
              <p style="font-size: 0.75rem; color: #4b5563; margin: 0; font-family: 'Lexend', sans-serif;">Commission</p>
              <p style="font-size: 1rem; font-weight: 500; color: #111827; margin: 0; font-family: 'Lexend', sans-serif;">${commission.commission_title}</p>
            </div>

            <div style="background-color: #f9fafb; padding: 0.75rem; border-radius: 0.375rem;">
              <p style="font-size: 0.75rem; color: #4b5563; margin: 0; font-family: 'Lexend', sans-serif;">Amount Due</p>
              <p style="font-size: 1rem; font-weight: 500; color: #111827; margin: 0; font-family: 'Lexend', sans-serif;">$${invoicePrice}</p>
            </div>
          </div>

          <div>
            <a 
              href="${paymentLink}"
              style="display: block; width: 100%; background-color: #2563eb; color: white; text-align: center; padding: 0.75rem 1rem; border-radius: 0.375rem; text-decoration: none; font-size: 1rem; font-weight: 500; box-sizing: border-box; font-family: 'Lexend', sans-serif;"
            >
              Pay Now →
            </a>
          </div>

          <div style="margin-top: 0.75rem; text-align: center;">
            <p style="font-size: 0.75rem; color: #6b7280; margin: 0; font-family: 'Lexend', sans-serif;">
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

  const createCheckoutSession = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(invoicePrice),
          description: commission.commission_title,
          responseId: commission.response_id,
          stripeAccount: await getStripeAccountId(),
          metadata: {
            responseId: commission.response_id,
            artistId: user.id
          },
        })
      })
      const data = await response.json();

      if (data.url) {
        setPaymentLink(data.url);
        await sendEmail(data.url);
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Error creating checkout session');
    }
  }

  const handlePaymentLink = async () => {
    setShowInvoiceOverlay(false);
    setInvoicePrice("");
    await updateResponse(commission.response_id, "Pending");
    toast.success("Invoice sent");
    onClose();
    onRefresh?.();
    await createCheckoutSession();
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
            className="bg-custom-jade hover:bg-custom-jade/90 active:scale-95 text-white font-bold py-2 px-8 rounded-full"
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
          <div className="bg-white rounded-lg p-6 max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Send Payment</h3>
            <p className="text-gray-700 mb-4">
              Enter the price for this commission to send an invoice to the client.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Form */}
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($USD)
                  </label>
                  <input
                    type="number"
                    value={invoicePrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = parseFloat(value);

                      // Check if it's a valid number
                      if (value === '' || (numValue >= 0 && numValue <= 5000)) {
                        // Check decimal places
                        const decimalPlaces = value.split('.')[1]?.length || 0;
                        if (decimalPlaces <= 2) {
                          setInvoicePrice(value);
                        }
                      }
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="0.00"
                    min="0"
                    max="5000"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-accent focus:border-transparent"
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
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-accent focus:border-transparent"
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
                    className="bg-custom-jade hover:bg-custom-jade/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded"
                  >
                    Send Invoice
                  </button>
                </div>
              </div>

              {/* Email Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Preview
                </label>
                <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                  <div
                    className="bg-white rounded-lg shadow-sm p-4 max-w-sm mx-auto"
                    style={{
                      backgroundColor: '#f3f4f6',
                      padding: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        padding: '1.25rem',
                        maxWidth: '28rem',
                        margin: '0 auto',
                      }}
                    >
                      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', margin: '0' }}>Payment Request</h1>
                        <p style={{ color: '#4b5563', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>from {artistName}</p>
                      </div>

                      {message && (
                        <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1.25rem' }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151', margin: '0 0 0.25rem 0' }}>Message:</p>
                          <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}>
                            <p style={{
                              color: '#1f2937',
                              fontStyle: 'italic',
                              margin: '0',
                              fontSize: '0.875rem',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'pre-wrap',
                              maxWidth: '100%'
                            }}>
                              {message}
                            </p>
                          </div>
                        </div>
                      )}

                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '0.75rem' }}>
                          <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: '0' }}>Commission</p>
                          <p style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0' }}>{commission.commission_title}</p>
                        </div>

                        <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.375rem' }}>
                          <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: '0' }}>Amount Due</p>
                          <p style={{ fontSize: '1rem', fontWeight: '500', color: '#111827', margin: '0' }}>${invoicePrice || '0.00'}</p>
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            display: 'block',
                            width: '100%',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            textAlign: 'center',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.375rem',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            fontWeight: '500',
                            boxSizing: 'border-box',
                          }}
                        >
                          Pay Now →
                        </div>
                      </div>

                      <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0' }}>
                          Secure payment powered by Stripe
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}