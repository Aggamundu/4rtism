import { useEffect, useState } from "react";
import { supabaseClient } from "../../../../utils/supabaseClient";
import { useScrollPrevention } from "../../../hooks/useScrollPrevention";
import { AnswerDisplay, CommissionRequest } from "../../types/Types";
import ImageDisplay from "./ImageDisplay";
import ServiceDisplay from "./ServiceDisplay";
import TextDisplay from "./TextDisplay";

interface AcceptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  commission?: CommissionRequest;
  title: string;
}

export default function ApprovalOverlay({ isOpen, onClose, commission, title }: AcceptOverlayProps) {
  const [submissionUrls, setSubmissionUrls] = useState<string[]>([]);

  useEffect(() => {
    getSubmissionUrls();
  }, []);

  // Prevent body scrolling when overlay is open
  useScrollPrevention(isOpen);

  if (!isOpen || !commission) return null;

  const getSubmissionUrls = async () => {
    const { data, error } = await supabaseClient.from("responses").select("submission_urls").eq("id", commission.response_id).single();
    if (error) {
      console.error('Error fetching submission urls:', error);
      throw error;
    }
    setSubmissionUrls(data.submission_urls);
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
        <div className="sticky top-0 bg-custom-offwhite border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="text-lg font-bold flex-1 text-center">{title}</div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col p-6 justify-center items-center gap-y-4">
            {submissionUrls && <ImageDisplay images={submissionUrls} title="Submission Images" />}
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
      </div>
    </div>
  );
}