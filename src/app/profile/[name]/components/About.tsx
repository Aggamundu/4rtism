'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabaseClient } from '../../../../../utils/supabaseClient';
import { useScrollPrevention } from '../../../../hooks/useScrollPrevention';
import Portfolio from '../portfolio-components/Portfolio';
import Services from '../services-components/Services';
import Banner from './Banner';
import { useRouter } from 'next/navigation';


interface AboutProps {
  imageSrc: string;
  displayName: string;
  userName: string;
  bio: string;
  instagram?: string;
  twitter?: string;
  bannerSrc?: string;
  showSettings?: boolean;
  onSettingsClick?: () => void;
  onUpdateProfile?: (updates: { displayName?: string; bio?: string; imageSrc?: string; bannerSrc?: string; instagram?: string; twitter?: string }) => void;
  onRefresh?: () => void;
}

export default function About({ imageSrc, displayName, userName, bio, bannerSrc, showSettings = false, onSettingsClick, onUpdateProfile, instagram, twitter, onRefresh }: AboutProps) {
  const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [showEditPortfolioOverlay, setShowEditPortfolioOverlay] = useState(false);
  const [showEditServicesOverlay, setShowEditServicesOverlay] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(displayName);
  const [editBio, setEditBio] = useState(bio);
  const [editImageSrc, setEditImageSrc] = useState(imageSrc);
  const [editBannerSrc, setEditBannerSrc] = useState(bannerSrc || '');
  const [editInstagram, setEditInstagram] = useState(instagram || '');
  const [editTwitter, setEditTwitter] = useState(twitter || '');
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const maxLength = 0; // Characters to show before "see more"

  // Update edit state when props change
  useEffect(() => {
    setEditDisplayName(displayName);
    setEditBio(bio);
    setEditImageSrc(imageSrc);
    setEditBannerSrc(bannerSrc || '');
    setEditInstagram(instagram || '');
    setEditTwitter(twitter || '');
  }, [displayName, bio, imageSrc, bannerSrc, instagram, twitter]);

  // Prevent body scrolling when any overlay is open
  useScrollPrevention(showOverlay || showEditOverlay || showEditPortfolioOverlay || showEditServicesOverlay);

  const shouldShowSeeMore = bio.length > maxLength;
  const handleSeeMore = () => {
    setShowOverlay(true);
  };

  const handleEditPortfolioClick = () => {
    setShowEditPortfolioOverlay(true);
  };
  const handleCloseEditPortfolioOverlay = () => {
    setShowEditPortfolioOverlay(false);
  };

  const handleEditServicesClick = () => {
    setShowEditServicesOverlay(true);
  };
  const handleCloseEditServicesOverlay = () => {
    setShowEditServicesOverlay(false);
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
    setEditInstagram(instagram || '');
    setEditTwitter(twitter || '');
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
          banner_url: editBannerSrc,
          instagram: editInstagram,
          twitter: editTwitter
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
          bannerSrc: editBannerSrc,
          instagram: editInstagram,
          twitter: editTwitter
        });
      }

      // Dispatch custom event to notify header to refresh
      window.dispatchEvent(new CustomEvent('profile-updated'));

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
        setImageLoading(true);
        const imageUrl = await uploadImageToStorage(file);
        setEditImageSrc(imageUrl);
      } catch (error) {
        console.error('Error uploading profile image:', error);
        // You might want to show an error message to the user
      } finally {
        setImageLoading(false);
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
      <div className="flex w-full flex-col items-start justify-left gap-x-6 px-custom sm:px-custom mt-[.5rem] flex-wrap">
        <div className="flex flex-row items-center gap-x-4 ">
          {imageSrc ? (
            <img src={imageSrc} alt="Profile" className="sm:w-[10rem] sm:h-[10rem] w-[8rem] h-[8rem] rounded-full border-2 border-custom-darkgray object-cover relative sm:top-[-6rem] top-[-4.5rem]" />
          ) : (
            <div className="bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center sm:w-[10rem] sm:h-[10rem] w-[8rem] h-[8rem] rounded-full border-2 border-custom-darkgray object-cover relative sm:top-[-6rem] top-[-4.5rem]">
              <span className="text-white font-semibold text-lg">
                {userName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
          {showSettings && (
            <div className="flex flex-col gap-y-1">
              <button
                onClick={() => router.push(`/edit-profile`)}
                className="text-xs hover:text-custom-blue hover:border-custom-blue transition-colors px-4 py-1 rounded-lg border border-custom-lightgray relative sm:top-[-2rem] top-[-1rem]"
              >
                Edit Profile
              </button>
              <button
                onClick={handleEditPortfolioClick}
                className="text-xs hover:text-custom-blue hover:border-custom-blue transition-colors px-4 py-1 rounded-lg border border-custom-lightgray relative sm:top-[-2rem] top-[-1rem]"
              >
                Edit Portfolio
              </button>
              <button
                onClick={handleEditServicesClick}
                className="text-xs hover:text-custom-blue hover:border-custom-blue transition-colors px-4 py-1 rounded-lg border border-custom-lightgray relative sm:top-[-2rem] top-[-1rem]"
              >
                Edit Services
              </button>
            </div>
          )}
        </div>

        <div className="relative sm:top-[-6rem] top-[-4.5rem]">
          <div className="text-md flex flex-row gap-x-2 items-center">
            {displayName}
            <div className="cursor-pointer"
              onClick={() => {
                toast.success('Profile link copied to clipboard');
                navigator.clipboard.writeText(window.location.href);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 -960 960 960"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240zm0-80h360v-480H360zM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80zm160-240v-480z" /></svg>
            </div>
          </div>
          <div className="text-sm text-custom-lightgray">@{userName}</div>
          <div className="text-sm text-custom-white max-w-full">
            <div className="whitespace-pre-wrap break-words">
              {bio.split('\n').slice(0, 3).join('\n')}
            </div>
            {bio.split('\n').length > 3 && !isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-custom-lightblue hover:text-white transition-colors text-sm"
              >
                Show more
              </button>
            )}
            {isExpanded && (
              <div className="whitespace-pre-wrap break-words">
                {bio.split('\n').slice(3).join('\n')}
              </div>
            )}
            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-custom-lightblue hover:text-white transition-colors text-sm mt-1"
              >
                Show less
              </button>
            )}
          </div>
          <div className="flex flex-row items-center gap-x-4  text-sm">
            <a href={editInstagram} target="_blank" className="flex flex-row items-center gap-x-1 text-custom-pink4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
              </svg>
              Instagram
            </a>

            <a href={editTwitter} target="_blank" className="flex flex-row items-center gap-x-1 text-custom-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
              </svg>
              Twitter
            </a>

          </div>
        </div>
      </div>

      {/* Bio Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-custom-darkpurple rounded-card w-full sm:w-[50rem] p-custom relative">
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
            <div className="text-whitebreak-words whitespace-pre-wrap">
              {bio}
            </div>
          </div>
        </div>
      )}

      {/* Edit Portfolio Overlay */}
      {showEditPortfolioOverlay && (
        <Portfolio onClose={handleCloseEditPortfolioOverlay} onRefresh={onRefresh} />
      )}

      {/* Edit Services Overlay */}
      {showEditServicesOverlay && (
        <Services onClose={handleCloseEditServicesOverlay} onRefresh={onRefresh} />
      )}

      {/* Edit Profile Overlay */}
      {showEditOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-custom-darkgray rounded-card max-h-[100vh] overflow-y-auto w-full sm:w-[40rem] relative">
            {/* Header */}
            <div className="sticky top-0 right-0 left-0 bg-custom-darkgray z-50 flex justify-between items-center p-6 border-b border-custom-gray">
              <button
                onClick={handleCloseEditOverlay}
                className="text-custom-accent hover:text-white transition-colors"
              >
                Cancel
              </button>
              <h2 className="text-white text-base font-semibold">Edit Profile</h2>
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="text-custom-accent hover:text-white transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6">
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
              </div>

              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-8">
                <label className="block text-custom-lightgray text-sm mb-3">Profile Picture</label>
                <div className="relative">
                  {editImageSrc ? (
                    <img
                      src={editImageSrc}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center w-24 h-24 rounded-full border-2 border-custom-darkgray object-cover">
                      <span className="text-white font-semibold text-lg">
                        {userName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}

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
                {imageLoading && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}
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
                    className="w-full bg-custom-gray text-white px-4 py-3 rounded-lg focus:outline-none transition-colors"
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
                    className="w-full bg-custom-gray text-custom-lightgray px-4 py-3 rounded-lg opacity-50 cursor-not-allowed"
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
                    className="w-full bg-custom-gray text-white px-4 py-1 rounded-lg focus:outline-none transition-colors resize-none"
                    placeholder="Write a bio..."
                  />
                  <div className="text-right text-custom-lightgray text-xs mt-1">
                    {editBio.length}/150
                  </div>
                </div>

                {/* Instagram */}
                <div>
                  <label className="block text-custom-lightgray text-sm mb-2">Instagram</label>
                  <input
                    type="text"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
                    className="w-full bg-custom-gray text-white px-4 py-3 rounded-lg focus:outline-none transition-colors"
                    placeholder="https://www.instagram.com/"
                  />
                </div>

                {/* Twitter */}
                <div>
                  <label className="block text-custom-lightgray text-sm mb-2">Twitter</label>
                  <input
                    type="text"
                    value={editTwitter}
                    onChange={(e) => setEditTwitter(e.target.value)}
                    className="w-full bg-custom-gray text-white px-4 py-3 rounded-lg focus:outline-none transition-colors"
                    placeholder="https://x.com/"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}