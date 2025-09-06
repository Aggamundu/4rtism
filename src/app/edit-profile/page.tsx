'use client'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { supabaseClient } from '../../../utils/supabaseClient'
import Banner from '../profile/[name]/components/Banner'

export default function EditProfile() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editImageSrc, setEditImageSrc] = useState('');
  const [editBannerSrc, setEditBannerSrc] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editTwitter, setEditTwitter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [userName, setUserName] = useState('');
  useEffect(() => {
    if (!user && !loading) {
      router.push('/')
    }
  }, [user])

  useEffect(() => {
    if (user && !loading) {
      getProfile()
    }
  }, [user])


  const getProfile = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single()
    if (error) {
      console.error(error)
    }
    setEditDisplayName(data.display_name)
    setEditBio(data.biography)
    setEditImageSrc(data.pfp_url)
    setEditBannerSrc(data.banner_url || '')
    setEditInstagram(data.instagram || '')
    setEditTwitter(data.twitter || '')
    setUserName(data.user_name)
  }

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

      // Dispatch custom event to notify header to refresh
      window.dispatchEvent(new CustomEvent('profile-updated'));

      router.push(`/profile/${userName}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };





  return (
    <div className="flex items-center justify-center pt-14 px-custom w-full">
      <div className="flex flex-col w-full sm:w-[60%]">
        <Header />
        {/* Header */}
        <div className="bg-custom-darkgray flex justify-between items-center p-4 border-b border-custom-gray">
          <button
            onClick={() => router.push(`/profile/${userName}`)}
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
        <div className="p-custom pb-24">
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
                    {editDisplayName?.charAt(0).toUpperCase() || 'U'}
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
              <label className="text-custom-lightgray text-sm mb-2">Display Name</label>
              <input
                type="text"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                className="w-full bg-custom-gray text-white px-4 py-3 rounded-lg focus:outline-none transition-colors"
                placeholder="Enter display name"
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
  )
}