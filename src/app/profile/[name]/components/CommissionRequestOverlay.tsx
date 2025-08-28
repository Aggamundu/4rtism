"use client"
import { useEffect, useRef, useState } from "react";
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from "../../../../../utils/supabaseClient";
import { useAuth } from "../../../../contexts/AuthContext";
import { Answer, Commission } from "../../../types/Types";
import Question from "./Question";
import UploadImages from "./UploadImages";

export default function CommissionRequestOverlay({
  isOpen,
  onClose,
  commission,
    
}: {
  isOpen: boolean,
  onClose: () => void,
  commission: Commission,

}) {


  const { image_urls, price, title, description, delivery_days, pfp_url, artist, questions } = commission;
  const [backgroundColor, setBackgroundColor] = useState("#1f2937");
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    image_urls: [] as string[],
    description: "",
    answers: [] as Answer[],
    instagram: "",
    discord: "",
    twitter: "",
    email: ""
  });

  // Reset state when commission changes (same pattern as ServiceOverlay)
  useEffect(() => {
    setFormData({
      image_urls: [],
      description: "",
      answers: [],
      instagram: "",
      discord: "",
      twitter: "",
      email: ""
    })
    setSelectedFiles([])
    setDeletedImageUrls([])
  }, [commission])

    // Extract edge color when component mounts or image changes
    useEffect(() => {
      if (image_urls && image_urls.length > 0) {
        extractEdgeColor(image_urls[0]); // Using the second image as in your code
      }
    }, [image_urls]);
  
    // Prevent body scrolling when overlay is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
  
      // Cleanup function to restore scrolling when component unmounts
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);


  const sendArtistEmail = async () => {
    fetch(`/api/artist-info`, {
      method: 'POST',
      body: JSON.stringify({ commissionId: commission?.id, email: formData.email })
    })
  }

  const checkButtonDisabled = () => {
    // Check if any required questions are missing answers
    const hasMissingRequiredQuestions = questions?.some(q => {
      if (!q.is_required) return false; // Skip non-required questions

      // Check if this required question has an answer
      const hasAnswer = formData.answers.some(a => a.question_id === q.id);

      // For different question types, check if the answer has content
      if (hasAnswer) {
        const answer = formData.answers.find(a => a.question_id === q.id);
        if (q.type === 'short-answer' || q.type === 'paragraph') {
          return !answer?.answer_text || answer.answer_text.trim() === '';
        } else if (q.type === 'multiple-choice') {
          return !answer?.selected_option_id;
        } else if (q.type === 'checkboxes') {
          return !answer?.selected_option_ids || answer.selected_option_ids.length === 0;
        }
      }

      return !hasAnswer; // No answer found for this required question
    });

    const hasValidEmail = formData.email !== "" && formData.email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email);

    return hasMissingRequiredQuestions || !hasValidEmail;
  }

  const getButtonClasses = () => {
    return checkButtonDisabled()
      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
      : 'bg-custom-accent text-white hover:bg-custom-accent/90 active:scale-95 cursor-pointer';
  }

  const hasValidEmail = () => {
    return formData.email !== "" && formData.email.trim() !== "" && /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email);
  }

  const saveAnswer = (answer: Answer) => {
    setFormData(prev => ({
      ...prev,
      answers: [...prev.answers.filter(a => a.question_id !== answer.question_id), answer]
    }));
  };

  const saveCheckboxAnswer = (questionId: number, optionId: number, isChecked: boolean) => {
    setFormData(prev => {
      const existingAnswer = prev.answers.find(a => a.question_id === questionId);
      let selectedIds = existingAnswer?.selected_option_ids || [];

      if (isChecked) {
        // Add option if checked
        selectedIds = [...selectedIds, optionId];
      } else {
        // Remove option if unchecked
        selectedIds = selectedIds.filter(id => id !== optionId);
      }

      const newAnswer = { question_id: questionId, selected_option_ids: selectedIds };

      return {
        ...prev,
        answers: [...prev.answers.filter(a => a.question_id !== questionId), newAnswer]
      };
    });
  };

  const saveEmail = async (email: string, responseId: number) => {
    const { data, error } = await supabaseClient.from("emails").insert({
      response_id: responseId,
      email: email
    });
  }

  const createResponse = async (image_urls: string[]) => {
    const { data, error } = await supabaseClient.from("responses").insert({
      commission_id: commission.id,
      user_id: user?.id,
      description: formData.description,
      image_urls: image_urls,
      status: "Request",
      payment: "Unpaid",
      instagram: formData.instagram,
      discord: formData.discord,
      twitter: formData.twitter,
    }).select();
    if (data) {
      console.log("Response created", data);
      await saveEmail(formData.email, data[0].id);
      await createAnswer(data[0].id, formData.answers);
      return data[0];
    } else {
      console.log("Error creating response", error);
      return null;
    }
  }

  const createAnswer = async (id: number, answers: Answer[]) => {
    for (const answer of answers) {
      const { data, error } = await supabaseClient.from("answers").insert({
        response_id: id,
        question_id: answer.question_id,
        answer_text: answer.answer_text,
        selected_option_id: answer.selected_option_id,
        selected_option_ids: answer.selected_option_ids
      });
    }
  }

  // Upload multiple images to Supabase Storage
  const uploadImagesToStorage = async (files: File[]): Promise<string[]> => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const uploadedUrls: string[] = [];

    // Upload each file individually
    for (const file of files) {
      const filePath = `${user?.id}/${uuidv4()}_${file.name}`;

      const { data, error } = await supabaseClient.storage
        .from('images')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      // Get public URL for this file
      const { data: urlData } = supabaseClient.storage
        .from('images')
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);

    }

    return uploadedUrls;
  };

  const handleSubmit = async () => {
    // Upload files to storage if any are selected
    onClose();
    let uploadedUrls: string[] = [];
    if (selectedFiles.length > 0) {
      uploadedUrls = await uploadImagesToStorage(selectedFiles);
      console.log("Uploaded URLs:", uploadedUrls);
    }

    // Update form data with uploaded image URLs
    const updatedFormData = {
      ...formData,
      image_urls: uploadedUrls
    };
    await sendArtistEmail();
    const response = await createResponse(updatedFormData.image_urls);
    if (response) {
      toast.success("Request sent successfully :)");
    } else {
      toast.error("Error sending request :(");
    }
  }


  // Function to extract edge color from image
  const extractEdgeColor = (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Sample pixels from the edges only
        const edgePixels = [];

        // Top edge
        for (let x = 0; x < width; x += 2) {
          const index = (0 * width + x) * 4;
          if (data[index + 3] > 128) { // Check alpha
            edgePixels.push({
              r: data[index],
              g: data[index + 1],
              b: data[index + 2]
            });
          }
        }

        // Bottom edge
        for (let x = 0; x < width; x += 2) {
          const index = ((height - 1) * width + x) * 4;
          if (data[index + 3] > 128) {
            edgePixels.push({
              r: data[index],
              g: data[index + 1],
              b: data[index + 2]
            });
          }
        }

        // Left edge
        for (let y = 0; y < height; y += 2) {
          const index = (y * width + 0) * 4;
          if (data[index + 3] > 128) {
            edgePixels.push({
              r: data[index],
              g: data[index + 1],
              b: data[index + 2]
            });
          }
        }

        // Right edge
        for (let y = 0; y < height; y += 2) {
          const index = (y * width + (width - 1)) * 4;
          if (data[index + 3] > 128) {
            edgePixels.push({
              r: data[index],
              g: data[index + 1],
              b: data[index + 2]
            });
          }
        }

        if (edgePixels.length > 0) {
          // Calculate average edge color
          const avgR = Math.round(edgePixels.reduce((sum, pixel) => sum + pixel.r, 0) / edgePixels.length);
          const avgG = Math.round(edgePixels.reduce((sum, pixel) => sum + pixel.g, 0) / edgePixels.length);
          const avgB = Math.round(edgePixels.reduce((sum, pixel) => sum + pixel.b, 0) / edgePixels.length);

          setBackgroundColor(`rgb(${avgR}, ${avgG}, ${avgB})`);
        }
      } catch (error) {
        console.log("Error extracting edge color:", error);
      }
    };

    img.onerror = () => {
      setBackgroundColor("#1f2937"); // Fallback to gray-800
    };

    img.src = imageUrl;
  };



  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`} onClick={onClose}>
      <div className="bg-custom-darkgray rounded-card max-h-[100vh] overflow-y-auto w-full pt-[3%] pl-[1%] relative scrollbar-thin scrollbar-thumb-custom-gray scrollbar-track-transparent hover:scrollbar-thumb-custom-lightgray" onClick={(e) => e.stopPropagation()}>
        <div className="fixed top-0 right-0 left-0 bg-custom-darkgray p-[1%] z-50 flex justify-end items-center border-b border-custom-gray">
          <button
            onClick={onClose}
            className="text-custom-lightgray hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-white pt-[5%] sm:pt-[0%]">
          <div className="flex flex-col sm:flex-row gap-[1%]">
            {/* Images - Slideshow on mobile, fixed column on desktop */}
            <div className="w-full sm:w-[40%] sm:h-[90vh] sm:overflow-y-auto sm:pr-4 sm:sticky sm:top-0 scrollbar-thin scrollbar-thumb-custom-gray scrollbar-track-transparent hover:scrollbar-thumb-custom-lightgray">
              {/* Mobile image */}
              <div className="sm:hidden">
                <div className="relative">
                  {image_urls && image_urls.length > 0 && (
                    <img
                      src={image_urls[0]}
                      className="w-full h-[10rem] object-contain rounded-lg"
                      style={{ backgroundColor }}
                      alt="Commission preview"
                    />
                  )}
                </div>

                {/* Hidden canvas for color extraction */}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Desktop grid */}
              <div className="hidden sm:grid grid-cols-1 gap-2">
                {image_urls?.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>

            {/* Content - Full width on mobile, 60% on desktop */}
            <div className="w-full sm:w-[60%] sm:h-[90vh] sm:overflow-y-auto scrollbar-thin scrollbar-thumb-custom-gray scrollbar-track-transparent hover:scrollbar-thumb-custom-lightgray">
              <p className="text-xl font-bold mb-1">{title}</p>
              <div className="relative -top-[1rem]">
                <div className="flex flex-row gap-[3%] text-lg text-custom-lightgray ">
                  <p>Est.${price}</p>
                  <div className="flex items-center gap-1">
                    <p>{delivery_days}sol</p>
                    <img src="/truck.svg" alt="truck" className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-[.5rem] ">
                <div className="flex flex-row gap-[1%] mb-[.5rem] items-center">
                  <img src={pfp_url} alt="pfp" className="w-[3.2rem] h-[3.2rem] rounded-full border-[1px] border-custom-lightgray object-cover" />
                  <div>
                    <p className="">@{artist}</p>
                  </div>
                </div>
                <div className="w-[100%] sm:w-[90%] border-[1px] border-custom-gray rounded-card p-custom">
                  <p className="break-words whitespace-pre-wrap text-custom-lightgray">{description}</p>
                </div>
                {/* Socials */}
                <div className="mb-[1%] flex flex-col gap-y-[2%]">
                  <div className="py-[1%]">
                    <span className="text-white text-sm font-medium">
                      Contact Information
                    </span>
                  </div>
                  <div className="flex flex-col gap-[1%] mb-[1%]">
                    <span className="text-custom-lightgray text-sm font-medium">
                      Email: {!hasValidEmail() && <span className="text-red-500">*</span>}
                    </span>
                    <input
                      className="sm:w-[90%] w-[100%] bg-custom-gray text-white rounded-lg p-3 focus:outline-none resize-none mb-[1%]"
                      placeholder=""
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                   <div className="py-[1%]">
                    <span className="text-white text-sm font-medium">
                      Socials <span className="ml-1 text-custom-lightgray text-xs font-medium">1 recommended</span>
                    </span>
                    </div>
                    <span className="text-custom-lightgray text-sm font-medium">
                      Instagram:
                    </span>
                    <input
                      className="sm:w-[90%] w-[100%] bg-custom-gray text-white rounded-lg p-3 focus:outline-none resize-none"
                      placeholder=""
                      onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-[1%] mb-[1%]">
                    <span className="text-custom-lightgray text-sm font-medium">
                      Discord:
                    </span>
                    <input
                      className="sm:w-[90%] w-[100%] bg-custom-gray text-white rounded-lg p-3 focus:outline-none resize-none"
                      placeholder=""
                      onChange={(e) => setFormData(prev => ({ ...prev, discord: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-[1%] mb-[1%]">
                    <span className="text-custom-lightgray text-sm font-medium">
                      Twitter:
                    </span>
                    <input
                      className="sm:w-[90%] w-[100%] bg-custom-gray text-white rounded-lg p-3 focus:outline-none resize-none"
                      placeholder=""
                      onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                    />
                  </div>

                </div>
                <div className = "sm:w-[90%]">
                <UploadImages onFilesChange={(files) => setSelectedFiles(files)}
                  onImagesChange={(images, deletedUrls) => {
                    setFormData(prev => ({ ...prev, image_urls: images }));
                    if (deletedUrls && deletedUrls.length > 0) {
                      setDeletedImageUrls(prev => [...prev, ...deletedUrls]);
                    }
                  }} initialImages={formData.image_urls} />
                </div>

                <div className="mb-[1%]">
                  <div className="py-[1%]">
                    <span className="text-white text-sm font-medium">
                      Describe your commission
                    </span>
                  </div>
                  <textarea
                    className="sm:w-[90%] w-[100%] bg-custom-gray text-white rounded-lg p-3 focus:outline-none resize-none"
                    rows={4}
                    placeholder="Enter your commission details..."
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                {questions?.map((question, index) => (
                  <Question key={index} question={question} saveAnswer={saveAnswer} saveCheckboxAnswer={saveCheckboxAnswer} />
                ))}
              </div>
              <div className="flex flex-row gap-[1%] mr-[10%] mb-[1%]">
                <div className="text-custom-lightgray text-sm italic">If your request is accepted, you'll be emailed a payment link from noreply@em6674.4rtism.com. Check your spam folder if you don't see it.</div>
              </div>
              <div className="flex justify-end mr-[10%]">
                <button
                  className={`px-4 py-2 rounded-full transition-all duration-200 ${getButtonClasses()}`}
                  onClick={handleSubmit}
                  disabled={checkButtonDisabled()}
                >
                  Request Commission
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}