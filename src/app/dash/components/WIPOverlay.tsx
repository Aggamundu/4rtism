import { AnswerDisplay, CommissionRequest } from "@/app/types/Types";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from "../../../../utils/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import { useScrollPrevention } from "../../../hooks/useScrollPrevention";
import UploadServiceImages from "../services-components/UploadServiceImages";
import ImageDisplay from "./ImageDisplay";
import ServiceDisplay from "./ServiceDisplay";
import TextDisplay from "./TextDisplay";

interface AcceptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  commission?: CommissionRequest;
  onRefresh?: () => void;
}

export default function WIPOverlay({ isOpen, onClose, commission, onRefresh }: AcceptOverlayProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [clientEmail, setClientEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [artistName, setArtistName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    if (commission) {
      getClientEmail(commission.response_id);
      getArtistName(user.id);
    }
  }, [commission, user]);

  // Prevent body scrolling when overlay is open
  useScrollPrevention(isOpen);

  if (!isOpen || !commission) return null;

  const getButtonClasses = () => {
    if (isSubmitting) {
      return 'bg-gray-400 text-gray-600 cursor-not-allowed';
    }
    return selectedFiles.length === 0
      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
      : 'bg-custom-accent text-white hover:bg-custom-accent/90 active:scale-95 cursor-pointer';
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
    console.log(data?.email);
    setClientEmail(data?.email || "");
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

  const uploadFilesToStorage = async (files: File[]) => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const downloadLinksAndUrls: {
      downloadLink: string;
      fileName: string;
    }[] = [];
    const submissionUrls: String[] = [];

    for (const file of files) {
      const filePath = `${user?.id}/${uuidv4()}_${file.name}`;
      const { data, error } = await supabaseClient.storage
        .from('work-files')
        .upload(filePath, file);
      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
      const { data: signedUrlData } = await supabaseClient.storage
        .from('work-files')
        .createSignedUrl(filePath, 60 * 24 * 60 * 60); // 60 days maximum

      downloadLinksAndUrls.push({
        downloadLink: signedUrlData?.signedUrl || '',
        fileName: file.name
      });
      submissionUrls.push(signedUrlData?.signedUrl || '');
    }
    const { data, error } = await supabaseClient.from("responses").update({
      submission_urls: submissionUrls
    }).eq("id", commission.response_id);
    if (error) {
      console.error('Error updating response:', error);
      throw error;
    }
    console.log('Response updated:', data);

    console.log('Generated download links:', downloadLinksAndUrls.map(link => ({
      fileName: link.fileName,
      downloadLink: link.downloadLink.substring(0, 100) + '...',
    })));
    return downloadLinksAndUrls;
  }

  const sendEmail = async (downloadLinksAndUrls: { downloadLink: string; fileName: string }[], token: string) => {
    const emailHTML = `
        <div style="background-color: #f3f4f6; padding: 0.75rem; font-family: 'Lexend', sans-serif;">
          <div style="background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 1.25rem; max-width: 28rem; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 1.25rem;">
              <h1 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin: 0; font-family: 'Lexend', sans-serif;">Work Submitted</h1>
              <p style="color: #4b5563; margin: 0.25rem 0 0 0; font-size: 0.875rem; font-family: 'Lexend', sans-serif;">${artistName} has submitted work for "${commission?.commission_title}"</p>
              <p style="color: #4b5563; margin: 0.25rem 0 0 0; font-size: 0.875rem; font-family: 'Lexend', sans-serif;">Links expire in 60 days. Please save your files within this time frame</p>
            </div>

            ${message ? `
            <div style="background-color: #f9fafb; padding: 0.75rem; border-radius: 0.375rem; margin-bottom: 1.25rem;">
              <p style="font-size: 0.875rem; color: #1f2937; margin: 0; margin-bottom: 1rem; font-family: 'Lexend', sans-serif;">
                ${message}
              </p>
              <p style="font-size: 0.875rem; color: #1f2937; margin: 0; font-family: 'Lexend', sans-serif;">
                - ${artistName}
              </p>
            </div>
            ` : ''}

            <!-- Download Links Section -->
            <div style="margin-bottom: 1.25rem;">
              <h2 style="font-size: 1rem; font-weight: 600; color: #1f2937; margin-bottom: 0.75rem; font-family: 'Lexend', sans-serif;">View/Download Files</h2>
              ${downloadLinksAndUrls.map((file, index) => {
      console.log(`Generating link ${index + 1}:`, file.downloadLink);
      return `
                <a 
                  href="${file.downloadLink}"
                  style="display: block; padding: 0.5rem; background-color: #f3f4f6; border-radius: 0.375rem; color: #2563eb; text-decoration: none; margin-bottom: 0.5rem; font-family: 'Lexend', sans-serif;"
                >
                  Download File ${index + 1}
                </a>
              `;
    }).join('')}
            </div>
            <div style="margin-bottom: 1.25rem; text-align: center;">
              <h2 style="font-size: 1rem; font-weight: 600; color: #1f2937; margin-bottom: 0.75rem; font-family: 'Lexend', sans-serif;">Approve or Reject</h2>
              <a 
                href="https://art-commission.vercel.app/action?token=${token}&action=accept"
                style="display: block; padding: 0.5rem; background-color: #f3f4f6; border-radius: 0.375rem; color: #2563eb; text-decoration: none; margin-bottom: 0.5rem; font-family: 'Lexend', sans-serif;"
              >
                Click here to accept
              </a>
              <a 
                href="https://art-commission.vercel.app/action?token=${token}&action=reject"
                style="display: block; padding: 0.5rem; background-color: #f3f4f6; border-radius: 0.375rem; color: #2563eb; text-decoration: none; margin-bottom: 0.5rem; font-family: 'Lexend', sans-serif;"
              >
                Click here to reject
              </a>
            </div>

            <div style="margin-top: 0.75rem; text-align: center;">
              <p style="font-size: 0.75rem; color: #6b7280; margin: 0; font-family: 'Lexend', sans-serif;">
                Powered by Artify
              </p>
            </div>
          </div>
        </div>
      `;
    let emailText = `Work from ${artistName} has been submitted${commission?.commission_title ? ` for "${commission.commission_title}"` : ''}.\n
    Links expire in 60 days. Please save your files within this time frame
    \n`;
    if (message) {
      emailText += `Message:\n${message}\n\n`;
    }
    emailText += 'View/Download Links:\n';
    emailText += downloadLinksAndUrls.map((file, index) => `${file.downloadLink}`).join('\n');

    const response = await fetch('/api/mail', {
      method: 'POST',
      body: JSON.stringify({
        to: clientEmail,
        subject: `${artistName} has submitted work for "${commission?.commission_title}"`,
        text: emailText,
        html: emailHTML
      }),
    });
    const data = await response.json();
    console.log('Email API response:', data);
  }

  const saveToken = async () => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const { data, error } = await supabaseClient.from("tokens").insert({
      response_id: commission.response_id,
      token: token,
      expiresAt: expiresAt
    });
    if (error) {
      console.error(error);
    }
    console.log('Token saved:', token);
    setToken(token);
    return token; // Return the token
  }

  const changeStatus = async () => {
    const { data, error } = await supabaseClient.from("responses").update({
      status: "Approval"
    }).eq("id", commission.response_id);
    if (error) {
      console.error(error);
    }
    console.log('Status changed:', data);
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const downloadLinksAndUrls = await uploadFilesToStorage(selectedFiles);
      const token = await saveToken();
      await sendEmail(downloadLinksAndUrls, token);
      toast.success("Work submitted successfully");
      onClose();
      await changeStatus();
      onRefresh?.();
    } catch (error) {
      console.error('Error submitting work:', error);
      toast.error("Failed to submit work. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-custom-offwhite rounded-card h-screen w-full flex flex-col">
        <div className="sticky top-0 bg-custom-offwhite border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="text-lg font-bold flex-1 text-center">Submit Work</div>
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
            <UploadServiceImages
              onFilesChange={(files) => setSelectedFiles(files)}
              title="Upload Work Files"
            />
            <div className="flex flex-col w-full sm:max-w-[60%]">
              <label className="text-black text-sm mb-2 font-bold">Message to Client</label>
              <textarea
                className="w-full h-32 p-3 rounded-lg resize-none border-none focus:outline "
                placeholder="Write a message to your client..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="bottom-0 bg-custom-offwhite border-t border-gray-200 px-6 py-4 flex flex-row justify-center gap-x-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-[70%] py-2 rounded-full transition-all duration-200 ${getButtonClasses()}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
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