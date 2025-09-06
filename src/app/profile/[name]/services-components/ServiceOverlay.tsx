
import TextArea from "@/app/dash/components/TextArea";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from "../../../../../utils/supabaseClient";
import { useScrollPrevention } from "../../../../hooks/useScrollPrevention";
import { Question } from "../../../types/Types";
import Category from "./Category";
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


interface ServiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
  onSuccess?: () => void;
  onRefresh?: () => void;
}

export default function ServiceOverlay({ isOpen, onClose, service, onSuccess, onRefresh }: ServiceOverlayProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    delivery_days: "",
    image_urls: [] as string[]
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    const hasValidPrice = formData.price.trim() && !priceError;
    const hasValidDeliveryTime = formData.delivery_days.trim().length > 0 && !deliveryTimeError;
    const hasImagesOrFiles = formData.image_urls && formData.image_urls.length > 0 || selectedFiles.length > 0;

    return hasTitle && hasDescription && hasValidPrice && hasValidDeliveryTime && hasImagesOrFiles;
  };

  // const getQuestions = async (serviceId: string) => {
  //   const { data, error } = await supabaseClient
  //     .from('questions')
  //     .select('*')
  //     .eq('commission_id', serviceId);

  //   if (error) {
  //     console.error(error);
  //   } else {
  //     const questions: Question[] = [];
  //     for(const question of data) {
  //       questions.push({
  //         id: question.id,
  //         title: question.question_text,
  //         type: question.type,
  //         required: question.is_required,
  //         options: question.options
  //       });
  //     }
  //     setQuestions(questions);
  //   }
  // }

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
      setCategory(service.category || "Chibi");
    }
  }, [service]);

  // Prevent body scrolling when overlay is open
  useScrollPrevention(isOpen);

  // Handle question changes
  const handleQuestionChange = (newQuestions: Question[], deletedIds: string[] = []) => {
    setQuestions(newQuestions);
    if (deletedIds.length > 0) {
      setDeletedQuestionIds(prev => [...prev, ...deletedIds]);
    }
  };


  const deleteQuestion = async (questionId: string) => {
    // First delete the question options
    const { error: optionsError } = await supabaseClient
      .from('question_options')
      .delete()
      .eq('question_id', parseInt(questionId));

    if (optionsError) {
      console.error('Error deleting question options:', optionsError);
    }

    // Then delete the question
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

  const deleteImagesFromStorage = async (imageUrls: string[]) => {
    for (const imageUrl of imageUrls) {
      try {
        // Extract the file path from the URL
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const { data: { user } } = await supabaseClient.auth.getUser();
        const filePath = `${user?.id}/${fileName}`;

        const { error } = await supabaseClient.storage
          .from('images')
          .remove([filePath]);

        if (error) {
          console.error('Error deleting image from storage:', error);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
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

  // Create options for a question
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
          option_text: option,
          order: question.options.indexOf(option)
        });
        throw error;
      }

      console.log('Option created successfully:', data);
    }
  }

  // Create questions for a commission
  //TODO Fix creating options
  const createQuestion = async (commissionId: number) => {
    console.log('Creating questions for commission:', commissionId);
    console.log('Questions to create:', questions);

    for (const question of questions) {
      console.log('Creating question:', question);

      const { data, error } = await supabaseClient.from('questions').insert({
        commission_id: commissionId,
        question_text: question.question_text,
        type: question.type,
        is_required: question.is_required,
      }).select();

      if (error) {
        console.error('Error creating question:', error);
        console.log('question data:', {
          commission_id: commissionId,
          question_text: question.question_text,
          type: question.type,
          is_required: question.is_required,
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

      // Delete removed images from storage
      if (deletedImageUrls.length > 0) {
        await deleteImagesFromStorage(deletedImageUrls);
        setDeletedImageUrls([]); // Clear the deleted image URLs list
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
        category: category,
      }).eq('id', service?.id);

      //Delete all questions
      await deleteQuestions(questions.map(q => q.id.toString()));

      // Create questions if any exist
      if (questions.length > 0 && service?.id) {
        await createQuestion(parseInt(service.id));
      }

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
      onRefresh?.();
      toast.success('Service updated successfully');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Error updating service. Please try again.');
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !service) return null;

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
          <h2 className="text-white text-base font-semibold">Edit Service</h2>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className="text-custom-accent hover:text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
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
              onImagesChange={(images, deletedUrls) => {
                setFormData(prev => ({ ...prev, image_urls: images }));
                if (deletedUrls && deletedUrls.length > 0) {
                  setDeletedImageUrls(prev => [...prev, ...deletedUrls]);
                }
              }}
              initialImages={formData.image_urls} />
            <div className="flex flex-col w-full sm:max-w-[60%] rounded-card px-custom py-[1%]">
              <TextInput
                title="Delivery Time (Days)"
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
            <Category value={category} onChange={setCategory} />
            <CreateForm onQuestionChange={handleQuestionChange} value={questions} />
          </div>
        </div>
      </div>
    </div>
  );
} 