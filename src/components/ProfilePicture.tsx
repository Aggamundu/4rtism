'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePictureProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLoading?: boolean;
  userId?: string; // Optional: for viewing other users' profiles
}

export default function ProfilePicture({
  size = 'md',
  className = '',
  showLoading = true,
  userId
}: ProfilePictureProps) {
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState('');
  const [googleAvatar, setGoogleAvatar] = useState('');
  const [profilePictureLoaded, setProfilePictureLoaded] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-6 h-6', text: 'text-xs' },
    md: { container: 'w-8 h-8', text: 'text-sm' },
    lg: { container: 'w-10 h-10', text: 'text-base' }
  };

  const currentSize = sizeConfig[size];

  // Helper function to get the profile picture with fallback hierarchy
  const getProfilePicture = (): string => {
    // Priority: database pfp -> Google avatar -> default
    if (profilePicture) return profilePicture;
    if (googleAvatar) return googleAvatar;
    return '';
  };

  // Fetch profile picture data
  const fetchProfileData = async () => {
    // Don't refetch if we already have data for the same user
    if (profilePictureLoaded && !userId) return;

    setProfilePictureLoaded(false);

    try {
      // If userId is provided, fetch that user's profile picture
      // Otherwise, use current user's data
      const targetUserId = userId || user?.id;

      if (targetUserId) {
        const { data, error } = await supabaseClient
          .from('profiles')
          .select('pfp_url')
          .eq('id', targetUserId)
          .single();

        if (!error && data) {
          setProfilePicture(data.pfp_url || '');
        }
      }

      // Get Google avatar from user metadata if available (only for current user)
      if (user && !userId) {
        const googleAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
        setGoogleAvatar(googleAvatarUrl || '');
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    } finally {
      setProfilePictureLoaded(true);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user?.id, userId]); // Only depend on user ID, not the entire user object

  return (
    <div className={`${currentSize.container} rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center ${className}`}>
      {!profilePictureLoaded && showLoading ? (
        <div className={`${currentSize.container} rounded-full bg-custom-darkgray animate-pulse`}></div>
      ) : getProfilePicture() !== '' ? (
        <img
          src={getProfilePicture()}
          alt="Profile"
          className={`${currentSize.container} rounded-full object-cover`}
        />
      ) : (
        <span className={`text-white font-semibold ${currentSize.text}`}>
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </span>
      )}
    </div>
  );
}
