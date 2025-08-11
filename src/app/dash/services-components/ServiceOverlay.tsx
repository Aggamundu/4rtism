
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from "../../../../utils/supabaseClient";
import TextArea from "../components/TextArea";
import CreateForm from "./CreateForm";
import TextInput from "./TextInput";
import UploadServiceImages from "./UploadServiceImages";

interface Service {
  id: string;
  title: string;
  price: string;
  description?: string;
  category?: string;
  delivery_days?: string;
  image_urls?: string[];
  questions?: Question[];
}

interface Question {
  id: string;
  title: string;
  type: 'short-answer' | 'paragraph' | 'multiple-choice' | 'checkboxes';
  required: boolean;
  options?: string[];
}

interface ServiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
  onSuccess?: () => void;
}

export default function ServiceOverlay({ isOpen, onClose, service, onSuccess }: ServiceOverlayProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    delivery_days: "",
    image_urls: [] as string[]
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation states
  const [priceError, setPriceError] = useState<string>("");
  const [deliveryTimeError, setDeliveryTimeError] = useState<string>("");

  // Validation functions
  const validatePrice = (value: string) => {
    if (value && (isNaN(parseFloat(value)) || parseFloat(value) <= 0)) {
      setPriceError("Please enter a valid positive number");
    } else {
      setPriceError("");
    }
  };

  const validateDeliveryTime = (value: string) => {
    if (value && (isNaN(parseInt(value)) || parseInt(value) <= 0)) {
      setDeliveryTimeError("Please enter a valid positive integer");
    } else {
      setDeliveryTimeError("");
    }
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    const hasTitle = formData.title.trim().length > 0;
    const hasDescription = formData.description.trim().length > 0;
    const hasValidPrice = formData.price.trim() && !priceError;
    const hasValidDeliveryTime = formData.delivery_days.trim().length > 0 && !deliveryTimeError;
    const hasImages = formData.image_urls && formData.image_urls.length > 0;

    return hasTitle && hasDescription && hasValidPrice && hasValidDeliveryTime && hasImages;
  };

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        description: service.description || "",
        price: String(service.price || ""),
        delivery_days: String(service.delivery_days || ""),
        image_urls: service.image_urls || []
      });
      setQuestions(service.questions || []);
    }
  }, [service]);

  const handleQuestionChange = (newQuestions: Question[], deletedIds: string[] = []) => {
    setQuestions(newQuestions);
    if (deletedIds.length > 0) {
      setDeletedQuestionIds(prev => [...prev, ...deletedIds]);
    }
  };


  const deleteQuestion = async (questionId: string) => {
    const { data, error } = await supabaseClient.from('questions').delete().eq('id', questionId);
    if (error) {
      console.error('Error deleting question:', error);
    }
  }

  const deleteQuestions = async (questionIds: string[]) => {
    for (const questionId of questionIds) {
      await deleteQuestion(questionId);
    }
  }

  useEffect(() => {
    console.log("Selected Files:", selectedFiles);
    console.log("urls", formData.image_urls);
  }, [selectedFiles]);

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
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim() || !formData.price.trim() || !formData.delivery_days.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      // Check for validation errors
      if (priceError || deliveryTimeError) {
        alert('Please fix the validation errors before submitting');
        return;
      }

      // Validate price and delivery time are valid numbers
      const price = parseFloat(formData.price);
      const deliveryDays = parseInt(formData.delivery_days);

      if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price');
        return;
      }

      if (isNaN(deliveryDays) || deliveryDays <= 0) {
        alert('Please enter a valid delivery time');
        return;
      }

      console.log("Updated Form Data:", formData);
      console.log("Updated Questions:", questions);

      // Delete removed questions from database
      if (deletedQuestionIds.length > 0) {
        await deleteQuestions(deletedQuestionIds);
        setDeletedQuestionIds([]); // Clear the deleted questions list
      }

      // Start with existing images from formData
      let finalImageUrls = [...formData.image_urls];

      // Upload new files and add their URLs
      if (selectedFiles.length > 0) {
        try {
          const newImages = await uploadImagesToStorage(selectedFiles);
          finalImageUrls.push(...newImages);
        } catch (error) {
          console.error('Error uploading images:', error);
          alert('Error uploading images. Please try again.');
          return;
        }
      }

      // Update formData with the final image URLs
      setFormData(prev => ({ ...prev, image_urls: finalImageUrls }));

      // Update the commission/service with the new data including the correct image URLs
      const { data, error } = await supabaseClient.from('commissions').update({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        delivery_days: formData.delivery_days,
        image_urls: finalImageUrls, // Use the final image URLs here
      }).eq('id', service?.id);

      if (error) {
        console.error('Error updating service:', error);
        alert('Error updating service. Please try again.');
        return;
      } else {
        onSuccess?.();
      }

      console.log('Service updated successfully');
      
      // Close the overlay after successful submission
      onClose();
    } catch (error) {
      console.error('Error updating service:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-custom-offwhite rounded-card max-h-[95vh] overflow-y-auto w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col p-6 justify-center items-center gap-y-4">
          <div className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">
            <TextInput
              title="Title *"
              value={formData.title}
              onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
              maxLength={50}
              showCharCount={true}
            />
          </div>
          <TextArea
            title="Description *"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            maxLength={500}
            showCharCount={true}
          />
          <div className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">
            <TextInput
              title="Price (USD) *"
              value={formData.price}
              onChange={(value) => {
                setFormData(prev => ({ ...prev, price: value }));
                validatePrice(value);
              }}
            />
            {priceError && (
              <div className="text-red-500 text-xs mt-1">
                {priceError}
              </div>
            )}
          </div>

          <UploadServiceImages
            onFilesChange={(files) => setSelectedFiles(files)}
            onImagesChange={(images) => setFormData(prev => ({ ...prev, image_urls: images }))}
            initialImages={formData.image_urls} />
          <div className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">
            <TextInput
              title="Delivery Time (Days) *"
              value={formData.delivery_days}
              onChange={(value) => {
                setFormData(prev => ({ ...prev, delivery_days: value }));
                validateDeliveryTime(value);
              }}
            />
            {deliveryTimeError && (
              <div className="text-red-500 text-xs mt-1">
                {deliveryTimeError}
              </div>
            )}
          </div>
          <CreateForm onQuestionChange={handleQuestionChange} value={questions} />
        </div>
        <div className="flex flex-row justify-center items-center gap-x-4 pb-[1%]">
          <button
            className={`rounded-card w-[50%] sm:w-[17%] py-[.5%] px-custom relative top-[10%] ${isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : isFormValid()
                ? 'bg-custom-accent text-white hover:bg-custom-darkAccent cursor-pointer'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 