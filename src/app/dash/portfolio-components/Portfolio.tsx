'use client';
import { useState } from 'react';
import UploadImage from "./UploadImage";
import { supabaseClient } from '../../../../utils/supabaseClient';

export default function Portfolio() {
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPortfolio = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('*').eq('user_id', user.id).single()
    if (data) {
      setImageUrls(data.image_urls)
    }
  }

  return (
    <div className="bg-custom-offwhite min-h-screen overflow-y-auto w-[100%] float-right text-black px-[5%] py-[.5%] rounded-[30px]">
      <div className="text-xl mb-6">
        Portfolio
      </div>
      <UploadImage
        onFilesChange={(files) => setSelectedFiles(files)}
        onImagesChange={(images, deletedUrls) => {
          setImageUrls(images);
          if (deletedUrls && deletedUrls.length > 0) {
            setDeletedImageUrls(prev => [...prev, ...deletedUrls]);
          }
        }}
        initialImages={formData.image_urls} />
    </div>
  );
}