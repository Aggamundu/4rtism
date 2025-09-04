"use client"
import UploadImages from "@/app/profile/[name]/components/UploadImages";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from "../../../utils/supabaseClient";

export default function Request() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user && !loading) {
      setError("Please login to post a request");
      console.log("error");
    }
  }, [user, loading]);

  const handlePost = async () => {
    if (!user?.id) {
      toast.error('Please login to post a request');
      return;
    }
    if (title.length < 3) {
      setError("Title must be at least 3 characters long");
    } else if (description.length < 10) {
      setError("Description must be at least 10 characters long");
    } else {
      setError("");
      const uploadedImages = await uploadImagesToStorage(selectedFiles);
      await createRequest(uploadedImages);
      setTitle("");
      setDescription("");
      toast.success("Request created successfully");
    }
  }

  const createRequest = async (uploadedImages: string[]) => {
    const { data, error } = await supabaseClient.from('requests').insert({
      title,
      description,
      image_urls: uploadedImages,
      user_id: user?.id,
    })
    console.log(data, error);
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

  return (
    <div className="flex flex-col pt-16 pb-[1%] min-h-screen items-center justify-center">
      <Header />

      <button
        onClick={() => router.push('/')}
        className="absolute top-14 left-4 text-white hover:text-gray-300 flex items-center gap-2 p-2 rounded-lg transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Home
      </button>
      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Drawing request title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-3 w-full p-3 bg-custom-darkgray border-2 border-white focus:bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none"
        />
        <textarea
          placeholder="Drawing request description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-3 w-full p-3 bg-custom-darkgray border-2 border-white focus:bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none"
        />
        <UploadImages
          onFilesChange={(files) => setSelectedFiles(files)}
          onImagesChange={(images, deletedUrls) => {
            setDeletedImageUrls(deletedUrls || []);
          }}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={handlePost}
          className="w-full flex items-center hover:bg-custom-blue/90 justify-center gap-3 bg-custom-blue text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          Post
        </button>
      </div>

    </div>
  );
}