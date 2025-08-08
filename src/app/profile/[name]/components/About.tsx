'use client';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from '../../../../../utils/supabaseClient';
import Banner from './Banner';


interface AboutProps {
  imageSrc: string;
  displayName: string;
  userName: string;
  bio: string;
  bannerSrc?: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  onUpdateProfile?: (updates: { displayName?: string; bio?: string; imageSrc?: string; bannerSrc?: string }) => void;
}

export default function About({ imageSrc, displayName, userName, bio, bannerSrc, showSettings = false, onSettingsClick, onUpdateProfile }: AboutProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(displayName);
  const [editBio, setEditBio] = useState(bio);
  const [editImageSrc, setEditImageSrc] = useState(imageSrc);
  const [editBannerSrc, setEditBannerSrc] = useState(bannerSrc || '');
  const [isLoading, setIsLoading] = useState(false);
  const maxLength = 50; // Characters to show before "see more"

  // Update edit state when props change
  useEffect(() => {
    setEditDisplayName(displayName);
    setEditBio(bio);
    setEditImageSrc(imageSrc);
    setEditBannerSrc(bannerSrc || '');
  }, [displayName, bio, imageSrc, bannerSrc]);

  const shouldShowSeeMore = bio.length > maxLength;
  const displayText = isExpanded ? bio : bio.slice(0, maxLength) + (shouldShowSeeMore ? '...' : '');

  const handleSeeMore = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleSettingsClick = () => {
    setShowEditOverlay(true);
    if (onSettingsClick) {
      onSettingsClick();
    }
  };

  const handleCloseEditOverlay = () => {
    setShowEditOverlay(false);
    setEditDisplayName(displayName);
    setEditBio(bio);
    setEditImageSrc(imageSrc);
    setEditBannerSrc(bannerSrc || '');
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      console.log('Saving profile with banner:', editBannerSrc);
      // Supabase logic here
      const { data, error } = await supabaseClient
        .from('profiles')
        .update({
          display_name: editDisplayName,
          biography: editBio,
          pfp_url: editImageSrc,
          banner_url: editBannerSrc
        })
        .eq('user_name', userName);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);

      // Call the parent callback with updated data
      if (onUpdateProfile) {
        await onUpdateProfile({
          displayName: editDisplayName,
          bio: editBio,
          imageSrc: editImageSrc,
          bannerSrc: editBannerSrc
        });
      }

      setShowEditOverlay(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  // Upload image to Supabase Storage
  const uploadImageToStorage = async (file: File): Promise<string> => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const filePath = user?.id + "/" + uuidv4();

    const { data, error } = await supabaseClient.storage
      .from('images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsLoading(true);
        const imageUrl = await uploadImageToStorage(file);
        setEditImageSrc(imageUrl);
      } catch (error) {
        console.error('Error uploading profile image:', error);
        // You might want to show an error message to the user
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBannerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Banner file selected:', file.name);
      try {
        setIsLoading(true);
        const imageUrl = await uploadImageToStorage(file);
        console.log('Banner uploaded successfully:', imageUrl);
        setEditBannerSrc(imageUrl);
      } catch (error) {
        console.error('Error uploading banner image:', error);
        // You might want to show an error message to the user
      } finally {
        setIsLoading(false);
      }
    }
  };


  return (
    <>
      <div className="flex w-full flex-row items-start justify-left gap-x-6 px-custom sm:px-custom mt-[.5rem] flex-wrap">
        <img src={imageSrc} alt="Profile" className="hidden sm:block w-[10rem] h-[10rem] rounded-full border-2 border-black object-cover relative top-[-4rem]" />
        <div className="hidden sm:flex flex-col items-left justify-start text-left relative top-[-1.5rem]">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold">{displayName}</div>

          </div>
          <div className="relative -top-2">
            <div className="flex flex-row items-center">
              <div className="text-base mb-0">@{userName}</div>
              <button className="bg-custom-gray w-7 h-7 justify-center text-white rounded-full hover:bg-opacity-80 transition-all flex items-center ml-[1%] mr-[1%]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              {showSettings && (
                <button
                  onClick={handleSettingsClick}
                  className="text-custom-white hover:text-custom-accent transition-colors px-4 py-1 rounded-lg border border-custom-lightgray text-sm font-medium"
                >
                  Edit profile
                </button>
              )}
            </div>
            <div className="text-sm text-custom-lightgray mb-0 relative top-1">
              {displayText}
              {shouldShowSeeMore && (
                <button
                  onClick={handleSeeMore}
                  className="text-custom-accent hover:text-custom-darkAccent font-medium ml-1"
                >
                  see more
                </button>
              )}
            </div>
          </div>
        </div>

        {/* mobile */}
        <div className="sm:hidden">
          <div className="flex flex-row">
            <img src={imageSrc} alt="Profile" className="w-[7rem] h-[7rem] rounded-full border-2 border-black mr-[1%] relative top-[-3.5rem]" />
            <div className="flex flex-col items-left justify-start text-left relative top-[-1.5rem]">
              <div className="flex items-center gap-4">
                <div className="text-md font-bold">{displayName}</div>
              </div>
              <div className="relative -top-2">
                <div className="flex flex-row items-center">
                  <div className="text-base mb-0">@{userName}</div>
                  <button className="bg-custom-gray w-7 h-7 justify-center text-white rounded-full hover:bg-opacity-80 transition-all flex items-center ml-[1%] mr-[1%]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
                {showSettings && (
                  <button
                    onClick={handleSettingsClick}
                    className="text-custom-white hover:text-custom-accent transition-colors px-4 py-1 rounded-lg border border-custom-lightgray text-sm font-medium mt-2"
                  >
                    Edit profile
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="text-sm text-custom-lightgray mb-0 relative top-[-2.6rem] mb-3">
            {displayText}
            {shouldShowSeeMore && (
              <button
                onClick={handleSeeMore}
                className="text-custom-accent hover:text-custom-darkAccent font-medium ml-1"
              >
                see more
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bio Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-custom-darkpurple rounded-card max-h-[95vh] overflow-y-auto w-full sm:w-[50rem] p-custom relative">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleCloseOverlay}
                className="absolute top-2 right-2 text-custom-lightgray hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-custom-lightgray">
              {bio}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Overlay */}
      {showEditOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-custom-darkpurple rounded-card max-h-[95vh] overflow-y-auto w-full sm:w-[40rem] p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-custom-gray pb-4">
              <button
                onClick={handleCloseEditOverlay}
                className="text-custom-accent hover:text-white transition-colors"
              >
                Cancel
              </button>
              <h2 className="text-white text-lg font-semibold">Edit Profile</h2>
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="text-custom-accent hover:text-white transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Done'}
              </button>
            </div>

            {/* Banner Section */}
            <div className="mb-8">
              <label className="block text-custom-lightgray text-sm mb-3">Banner Image</label>
              <div className="relative">
                <div className="w-full h-32 rounded-lg overflow-hidden">
                  <Banner imageSrc={editBannerSrc || null} />
                </div>
                <label className="absolute top-2 right-2 bg-custom-accent text-white rounded-full p-2 cursor-pointer hover:bg-opacity-80 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                </label>
                {editBannerSrc && (
                  <button
                    onClick={() => setEditBannerSrc('')}
                    className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-2 cursor-pointer hover:bg-opacity-80 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              <button className="text-custom-accent mt-2 text-sm hover:text-white transition-colors">
                Change banner image
              </button>
            </div>

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={editImageSrc}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-custom-gray object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-custom-accent text-white rounded-full p-2 cursor-pointer hover:bg-opacity-80 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <button className="text-custom-accent mt-2 text-sm hover:text-white transition-colors">
                Change profile photo
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Display Name */}
              <div>
                <label className="block text-custom-lightgray text-sm mb-2">Display Name</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full bg-custom-gray text-white px-4 py-3 rounded-lg border border-custom-lightgray focus:border-custom-accent focus:outline-none transition-colors"
                  placeholder="Enter display name"
                />
              </div>

              {/* Username (Read-only) */}
              <div>
                <label className="block text-custom-lightgray text-sm mb-2">Username</label>
                <input
                  type="text"
                  value={`@${userName}`}
                  disabled
                  className="w-full bg-custom-gray text-custom-lightgray px-4 py-3 rounded-lg border border-custom-lightgray opacity-50 cursor-not-allowed"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-custom-lightgray text-sm mb-2">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={4}
                  maxLength={150}
                  className="w-full bg-custom-gray text-white px-4 py-3 rounded-lg border border-custom-lightgray focus:border-custom-accent focus:outline-none transition-colors resize-none"
                  placeholder="Write a bio..."
                />
                <div className="text-right text-custom-lightgray text-xs mt-1">
                  {editBio.length}/150
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}