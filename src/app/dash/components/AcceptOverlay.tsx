import { useState } from "react";
import { toast } from "react-hot-toast";
import { AnswerDisplay, CommissionRequest } from "../../types/Types";
import ImageDisplay from "./ImageDisplay";
import ServiceDisplay from "./ServiceDisplay";
import TextDisplay from "./TextDisplay";
import { supabaseClient } from "../../../../utils/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

interface AcceptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  commission?: CommissionRequest;
}

export default function AcceptOverlay({ isOpen, onClose, commission }: AcceptOverlayProps) {
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  const [showInvoiceOverlay, setShowInvoiceOverlay] = useState(false);
  const [invoicePrice, setInvoicePrice] = useState("");
  const { user } = useAuth();
  if (!isOpen || !commission) return null;
  const getStripeAccountId = async () => {
    const { data, error } = await supabaseClient.from("profiles").select("stripe_account_id").eq("id", user?.id).single();
    if (error) {
      console.error(error);
    }
    return data?.stripe_account_id;
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
          description:commission.commission_title,
          stripeAccount: await getStripeAccountId(),
          metadata: {
            commissionId: commission.commission_id,
          },
        })
      })
      const data = await response.json();
      if(data.paymentLink) {
        window.open(data.paymentLink, '_blank');
      } else if(data.error) {
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
    onClose();
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Send Invoice</h3>
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