'use client'

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Only close if menu is open and click is outside the dropdown area
      if (isMenuOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

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
  };

  if (loading) {
    return (
      <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 h-14">
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
    <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 h-14">
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
              <div className="flex items-center space-x-4">

                <div className="relative">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                    aria-haspopup="menu"
                    aria-expanded={isMenuOpen}
                    aria-controls="profile-menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                      {user.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
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
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50" ref={dropdownRef} id="profile-menu">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
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
                      <hr className="border-gray-700 my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Unauthenticated User */
              <div className="flex items-center">
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
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/create-account"
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
                  >
                    Sign Up
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