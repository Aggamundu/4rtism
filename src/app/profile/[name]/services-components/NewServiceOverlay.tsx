import TextArea from "@/app/dash/components/TextArea";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from "../../../../../utils/supabaseClient";
import { useAuth } from "../../../../contexts/AuthContext";
import { useScrollPrevention } from "../../../../hooks/useScrollPrevention";
import Category from "./Category";
import CreateForm from "./CreateForm";
import TextInput from "./TextInput";
import UploadServiceImages from "./UploadServiceImages";

interface Service {
  id: string;
  image: string;
  title: string;
  price: string;
  description?: string;
  category?: string;
  deliveryTime?: string;
  images?: string[];
}

interface ServiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onRefresh?: () => void;
}

export default function NewServiceOverlay({ isOpen, onClose, onSuccess, onRefresh }: ServiceOverlayProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    deliveryTime: "",
    images: [] as string[],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [artistName, setArtistName] = useState<string>("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<string>("Chibi");

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
    const hasImages = selectedFiles.length > 0;
    const hasValidPrice = formData.price.trim().length > 0 && !priceError;
    const hasValidDeliveryTime = formData.deliveryTime.trim().length > 0 && !deliveryTimeError;

    return hasTitle && hasDescription && hasImages && hasValidPrice && hasValidDeliveryTime;
  };

  const handleQuestionChange = (newQuestions: any[]) => {
    setQuestions(newQuestions);
  };

  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      deliveryTime: "",
      images: [] as string[],
    });
    setSelectedFiles([]);
    setQuestions([]);
    setPriceError("");
    setDeliveryTimeError("");
    setCategory("Chibi"); // Reset to default instead of empty string
  };

  const createOptions = async (question: any, questionId: string) => {
    console.log('Creating options for question:', questionId);
    console.log('Options to create:', question.options);

    for (const option of question.options) {
      console.log('Creating option:', option);

      const { data, error } = await supabaseClient.from('question_options').insert({
        question_id: questionId,
        option_text: option.option_text,
        order: question.options.indexOf(option)
      });

      if (error) {
        console.error('Error creating option:', error);
        console.log('option data:', {
          question_id: questionId,
          option_text: option.option_text,
          order: question.options.indexOf(option)
        });
        throw error;
      }

      console.log('Option created successfully:', data);
    }
  }

  const createQuestion = async (commissionId: string) => {
    console.log('Creating questions for commission:', commissionId);
    console.log('Questions to create:', questions);

    for (const question of questions) {
      console.log('Creating question:', question);

      const { data, error } = await supabaseClient.from('questions').insert({
        commission_id: commissionId,
        question_text: question.title,
        type: question.type,
        is_required: question.required,
      }).select();

      if (error) {
        console.error('Error creating question:', error);
        console.log('question data:', {
          commission_id: commissionId,
          question_text: question.title,
          type: question.type,
          is_required: question.required,
        });
        throw error;
      }

      console.log('Question created successfully:', data);

      if (data && (data[0].type === 'multiple-choice' || data[0].type === 'checkboxes') && question.options && question.options.length > 0) {
        console.log('Creating options for question:', data[0].id);
        await createOptions(question, data[0].id);
      }
    }
  }

  const getArtistName = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('user_name').eq('id', user?.id).single();
    setArtistName(data?.user_name);
  }

  // Get artist name from profile
  useEffect(() => {
    if (user?.id) {
      getArtistName();
    }
  }, [user?.id, category]);

  // Prevent body scrolling when overlay is open
  useScrollPrevention(isOpen);

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
      if (!formData.title.trim() || !formData.description.trim() || !formData.price.trim() || !formData.deliveryTime.trim()) {
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
      const deliveryDays = parseInt(formData.deliveryTime);

      if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price');
        return;
      }

      if (isNaN(deliveryDays) || deliveryDays <= 0) {
        alert('Please enter a valid delivery time');
        return;
      }

      console.log("Form Data:", formData);
      console.log("Selected Files:", selectedFiles);

      // Upload files to storage if any are selected
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedUrls = await uploadImagesToStorage(selectedFiles);
        console.log("Uploaded URLs:", uploadedUrls);
      }

      // Update form data with uploaded image URLs
      const updatedFormData = {
        ...formData,
        images: uploadedUrls
      };

      console.log('Category being saved:', category); // Debug log

      // Create the commission/service with the updated data
      const { data: commissionData, error } = await supabaseClient.from('commissions').insert({
        title: updatedFormData.title,
        description: updatedFormData.description,
        price: price,
        delivery_days: deliveryDays,
        image_urls: updatedFormData.images,
        profile_id: user?.id,
        artist: artistName,
        category: category,
      }).select();

      if (error) {
        console.error('Error creating commission:', error);
        throw error;
      }

      console.log('Commission created successfully:', commissionData);

      // Create questions if any exist
      if (questions.length > 0 && commissionData && commissionData[0]) {
        await createQuestion(commissionData[0].id);
      }

      // Clear the form and close the overlay after successful submission
      clearForm();
      onSuccess?.();
      onClose();
      onRefresh?.();
      toast.success('Service created successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error creating service. Please try again.');
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-custom-darkgray rounded-card max-h-[100vh] overflow-y-auto w-full relative">
        {/* Header */}
        <div className="sticky top-0 bg-custom-darkgray z-10 flex justify-between items-center p-6 border-b border-custom-gray">
          <button
            onClick={onClose}
            className="text-custom-accent hover:text-white transition-colors"
          >
            Cancel
          </button>
          <h2 className="text-white text-base font-semibold">Create New Service</h2>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className="text-custom-accent hover:text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="flex flex-col justify-center items-center gap-y-4">
            <div className="flex flex-col w-full sm:max-w-[60%] rounded-card px-custom py-[1%]">
              <TextInput
                title="Title"
                value={formData.title}
                onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                maxLength={50}
                showCharCount={true}
              />
            </div>

            <TextArea
              title="Description"
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              maxLength={500}
              showCharCount={true}
            />
            <div className="flex flex-col sm:max-w-[60%] w-full rounded-card px-custom py-[1%]">
              <TextInput
                title="Price (USD)"
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
            />
            <div className="flex flex-col w-full sm:max-w-[60%] rounded-card px-custom py-[1%]">
              <TextInput
                title="Delivery Time (Days)"
                value={formData.deliveryTime}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, deliveryTime: value }));
                  validateDeliveryTime(value);
                }}
              />
              {deliveryTimeError && (
                <div className="text-red-500 text-xs mt-1">
                  {deliveryTimeError}
                </div>
              )}
            </div>
            <Category value={category} onChange={setCategory} />
            <CreateForm onQuestionChange={handleQuestionChange} />
          </div>
        </div>
      </div>
    </div>
  );
} 