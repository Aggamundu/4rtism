'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from '../../../../../utils/supabaseClient';
import { useAuth } from '../../../../contexts/AuthContext';
import { useScrollPrevention } from '../../../../hooks/useScrollPrevention';
import UploadImage from "./UploadImage";

export default function Portfolio({ onClose, onRefresh }: { onClose: () => void, onRefresh?: () => void }) {
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0); // Add reset key
  const { user } = useAuth();

  const fetchPortfolioUrls = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('portfolio_urls').eq('id', user.id).single()
    if (data) {
      setImageUrls(data.portfolio_urls);
      setSelectedFiles([]);
      setDeletedImageUrls([]);
    } else {
      console.error(error);
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
    setIsLoading(true);
    // Delete removed images from storage
    if (deletedImageUrls.length > 0) {
      await deleteImagesFromStorage(deletedImageUrls);
      setDeletedImageUrls([]); // Clear the deleted image URLs list
    }
    let finalImageUrls = [...(imageUrls || [])];

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

    const { data, error } = await supabaseClient.from('profiles').update({ portfolio_urls: finalImageUrls }).eq('id', user.id)
    if (error) {
      console.error(error);
      alert('Error updating portfolio. Please try again.');
      setIsLoading(false);
      return;
    } else {
      // Update local state and reset component
      setImageUrls(finalImageUrls);
      setSelectedFiles([]);
      setResetKey(prev => prev + 1); // Increment reset key to reset UploadImage
      setIsLoading(false);
      toast.success('Portfolio updated successfully');
      onRefresh?.(); // Call onRefresh if provided
    }
  }

  useEffect(() => {
    fetchPortfolioUrls();
  }, [user]);

  // Prevent body scrolling when overlay is open
  useScrollPrevention(true);

  return (
    <div className="flex items-center justify-center pt-14 px-custom w-full">
      <div className="flex flex-col w-full sm:w-[60%]">
        {/* Header */}
        <div className="sticky top-0 bg-custom-darkgray flex justify-between items-center p-6 border-b border-custom-gray">
          <button
            onClick={onClose}
            className="text-custom-accent hover:text-white transition-colors"
          >
            Cancel
          </button>
          <h2 className="text-white text-base font-semibold">Edit Portfolio</h2>
          <button
            onClick={() => {
              handleSubmit();
              onClose();
            }}
            disabled={isLoading}
            className="text-custom-accent hover:text-white transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 pb-24 sm:pb-0">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-pink4"></div>
            </div>
          ) : (
            <UploadImage
              key={resetKey} // Add key to force re-render
              resetKey={resetKey}
              onFilesChange={(files) => setSelectedFiles(files)}
              onImagesChange={(images, deletedUrls) => {
                setImageUrls(images);
                if (deletedUrls && deletedUrls.length > 0) {
                  setDeletedImageUrls(prev => [...prev, ...deletedUrls]);
                }
              }}
              initialImages={imageUrls} />
          )}
        </div>
      </div>
    </div>
  );
}