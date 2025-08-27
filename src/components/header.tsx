'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabaseClient } from '../../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onRefresh?: () => void;
}

export default function Header({ onRefresh }: HeaderProps) {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [search, setSearch] = useState('');
  const router = useRouter();
  const feedbackRef = useRef<HTMLDivElement>(null);

  const handleSendFeedback = async () => {
    const { data, error } = await supabaseClient
      .from('feedback')
      .insert({feedback: feedback });
    if (error) {
      toast.error('Error sending feedback');
    } else {
      toast.success('Feedback sent successfully');
      setIsFeedbackOpen(false);
      setFeedback('');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (search.trim() !== '') {
      router.push(`/search?query=${encodeURIComponent(search)}`);
    }
  };

  const getNameAndProfilePicture = async () => {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('user_name, pfp_url')
      .eq('id', user?.id);
    setUsername(data?.[0]?.user_name);
    setProfilePicture(data?.[0]?.pfp_url);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Only close if menu is open and click is outside the dropdown area
      if (isMenuOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      // Close feedback if open and click is outside the feedback container
      if (isFeedbackOpen && feedbackRef.current && !feedbackRef.current.contains(event.target as Node)) {
        setIsFeedbackOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen, isFeedbackOpen]);

  useEffect(() => {
    getNameAndProfilePicture();
  }, [user]);

  // Listen for profile updates and refresh
  useEffect(() => {
    if (onRefresh) {
      // Create a custom event listener for profile updates
      const handleProfileUpdate = () => {
        getNameAndProfilePicture();
      };

      // Listen for custom profile update events
      window.addEventListener('profile-updated', handleProfileUpdate);

      return () => {
        window.removeEventListener('profile-updated', handleProfileUpdate);
      };
    }
  }, [onRefresh]);

  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    setIsMenuOpen(!isMenuOpen);
    setIsFeedbackOpen(false);
  };

  if (loading) {
    return (
      <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 fixed top-0 left-0 right-0 z-40 h-14 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <div className="h-7 w-28 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-7 w-24 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 fixed top-0 left-0 right-0 z-40 h-14 w-full">
      <div className="w-full mx-auto px-custom">
        <div className="flex justify-between items-center h-14">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/home" className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <span className="text-white font-semibold text-base">rtism</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-2">
            {/* Desktop search */}
            <div className="hidden md:flex items-center w-full max-w-xl mx-auto">
              <div className="flex w-full">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-[#121212] text-white h-10 px-3 pl-10 rounded-full border border-[#303030] focus:border-blue-500 focus:outline-none text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(e as any);
                      }
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile search */}
            <div className="md:hidden flex items-center w-full max-w-sm mx-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-[#121212] text-white h-9 pl-10 pr-3 rounded-full border border-[#303030] focus:border-blue-500 focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e as any);
                    }
                  }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              /* Authenticated User */
              <div className="flex flex-row items-center space-x-4">
                <div className="relative" ref={feedbackRef}>
                  <button
                    onClick={() => { setIsFeedbackOpen(!isFeedbackOpen); setIsMenuOpen(false); }}
                    className="hidden sm:block text-xs text-white border-[1px] border-custom-lightgray hover:border-white rounded-lg px-2 py-1 transition-colors duration-200">
                    Feedback
                  </button>
                  {isFeedbackOpen && (
                    <div className="absolute right-0 w-[225px] bg-custom-gray rounded-lg shadow-lg z-50 p-[10%] mt-1">
                      <textarea
                        placeholder="Suggestions, bugs, secrets, messages for me, etc."
                        className="w-full h-24 bg-custom-gray text-white rounded-lg p-2 border-[1px] border-white focus:outline-none text-xs"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                      <button onClick={handleSendFeedback} className="text-xs text-white border-[1px] border-custom-lightgray hover:border-white rounded-lg px-2 py-1 transition-colors duration-200 float-right">
                        Send
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative">

                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                    aria-controls="profile-menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold text-sm">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <svg className={`w-4 h-4 hidden md:block transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 w-48 bg-gray-800 rounded-sm shadow-lg z-50 mt-1" ref={dropdownRef} id="profile-menu">
                      <Link
                        href={`/profile/${username}`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:rounded-t-sm hover:text-white transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/dash"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/help"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        About
                      </Link>
                      <hr className="border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                      <Link
                        href="/forgot-password"
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Change Password
                      </Link>
                      <Link
                        href="/delete-account"
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Delete Account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Unauthenticated User */
              <div className="flex flex-row items-center space-x-4">
                 <div className="relative" ref={feedbackRef}>
                  <button
                    onClick={() => { setIsFeedbackOpen(!isFeedbackOpen); setIsMenuOpen(false); }}
                    className="hidden sm:block text-xs text-white border-[1px] border-custom-lightgray hover:border-white rounded-lg px-2 py-1 transition-colors duration-200">
                    Feedback
                  </button>
                  {isFeedbackOpen && (
                    <div className="absolute right-0 w-[225px] bg-custom-gray rounded-lg shadow-lg z-50 p-[10%] mt-1">
                      <textarea
                        placeholder="Suggestions, bugs, secrets, messages for me, etc."
                        className="w-full h-24 bg-custom-gray text-white rounded-lg p-2 border-[1px] border-white focus:outline-none text-xs"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                      <button onClick={handleSendFeedback} className="text-xs text-white border-[1px] border-custom-lightgray hover:border-white rounded-lg px-2 py-1 transition-colors duration-200 float-right">
                        Send
                      </button>
                    </div>
                  )}
                </div>
                {/* Compact mobile icon */}
                <Link href="/login" className="md:hidden p-2 rounded-full hover:bg-gray-800 text-gray-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
                {/* Full desktop links */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-white text-xs hover:text-white border-[1px] border-custom-lightgray hover:border-white rounded-lg px-2 py-1 transition-colors duration-200"
                  >
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* No mobile hamburger/menu; profile/login icon shown instead */}

        </div>

        {/* No mobile dropdown menu; search stays centered and profile/login icon on the right */}

      </div>
    </header>
  );
}