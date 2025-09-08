'use client'

import { Home, LayoutDashboard, Menu, MessageCircle, PlusSquare, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onRefresh?: () => void;
  showSettings?: boolean;
}

export default function Header({ onRefresh, showSettings }: HeaderProps) {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [search, setSearch] = useState('');
  const router = useRouter();





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
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

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
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
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
    <>
      <header className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 fixed top-0 left-0 right-0 z-40 h-14 w-full">
        <div className="w-full mx-auto px-custom">
          <div className="flex justify-between items-center h-14">
            {/* Hamburger Menu */}
            <div className="flex items-center">
              <Menu className="w-6 h-6 mr-4 text-white cursor-pointer sm:block hidden" onClick={() => setIsHamburgerOpen(true)} />

              {/* Logo/Brand */}
              <div className="flex items-center min-w-fit">
                <Link href="/" className="flex items-center space-x-4">
                  <div className="w-7 h-7 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <span className="text-white font-semibold text-base">rtism</span>
                </Link>
              </div>
            </div>


            {/* Search Bar */}
            <div className="flex-1 mx-2 flex flex-row gap-2">
              {/* Desktop search */}
              <div className="hidden sm:flex items-center justify-center flex-1">
                <div className="flex w-[60%]">
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

            </div>

            <div className="sm:hidden flex items-center min-w-fit gap-2" >
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => setIsSearchExpanded(!isSearchExpanded)}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {showSettings && (
                <div className="relative">
                  <button
                    className="p-1 hover:bg-gray-800 rounded-full transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <Settings className="w-5 h-5 text-gray-400" />
                  </button>

                  {/* Mobile Settings Dropdown */}
                  {isMenuOpen && (
                    <div className="absolute right-0 w-48 bg-gray-800 rounded-sm shadow-lg z-50 mt-1">
                      <Link
                        href={`/my-requests`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:rounded-t-sm hover:text-white transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Requests
                      </Link>
                      <Link
                        href={`/stripe`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:rounded-t-sm hover:text-white transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Stripe
                      </Link>
                      <Link
                        href={`/help`}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:rounded-t-sm hover:text-white transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Help
                      </Link>
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
                      <button
                        onClick={() => router.push('/delete-account')}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors duration-200"
                      >
                        Delete Account
                      </button>

                      {/* Add other menu items as needed */}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={`sm:hidden fixed top-0 left-0 w-full z-50 h-16 bg-[#121212] flex items-center px-4 ${isSearchExpanded ? 'translate-y-0' : '-translate-y-full'}`}>
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
                      setIsSearchExpanded(false);
                    }
                  }}
                  autoFocus
                />
                <button
                  className="absolute inset-y-0 left-3 flex items-center text-gray-400"
                  onClick={() => setIsSearchExpanded(false)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Auth Section */}
            <div className="sm:block hidden flex items-center space-x-4">
              {user ? (
                /* Authenticated User */
                <div className="flex flex-row items-center space-x-4">
                  {/* <button onClick={() => router.push('/request')} className="text-xs text-white border-[1px] border-custom-lightgray hover:border-white rounded-lg px-2 py-1 transition-colors duration-200 hidden sm:block">
                    + Post Request
                  </button> */}

                  <div className="relative">

                    <button
                      onClick={handleProfileClick}
                      className="flex items-center hidden sm:block space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                      aria-controls="profile-menu"
                    >
                      <div className="flex items-center space-x-2">
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
                        <svg className={`w-4 h-4 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
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
                  <button onClick={() => router.push('/messaging')} className="text-xs text-white border-[1px] border-custom-lightgray hover:border-white rounded-lg px-2 py-1 transition-colors duration-200">
                    Messages
                  </button>
                  {/* Compact mobile icon */}
                  <Link href="/signup" className="sm:hidden p-2 rounded-full hover:bg-gray-800 text-gray-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </Link>
                  {/* Full desktop links */}
                  <div className="hidden sm:flex items-center space-x-4">
                    <Link
                      href="/signup"
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

        </div>
      </header>

      {/* Backdrop Overlay - makes page darker when menu is open */}
      {isHamburgerOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsHamburgerOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-custom-darkgray px-custom pt-4 backdrop-blur-md shadow-lg z-50 transform transition-transform duration-300
        ${isHamburgerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <Menu className="w-6 h-6 text-white cursor-pointer" onClick={() => setIsHamburgerOpen(false)} />
        </div>

        <nav className="space-y-3">
          <a href="/" className="block text-white hover:text-blue-400 transition-colors">Home</a>
          <a href="/request" className="block text-white hover:text-blue-400 transition-colors">Post Request</a>
          <a href="/messaging" className="block text-white hover:text-blue-400 transition-colors">Messages</a>
          <a href={`/profile/${username}`} className="block text-white hover:text-blue-400 transition-colors">Profile</a>
          <a href="/dash" className="block text-white hover:text-blue-400 transition-colors">Dashboard</a>
          <a href="/my-requests" className="block text-white hover:text-blue-400 transition-colors">My Requests</a>
          <a href="/stripe" className="block text-white hover:text-blue-400 transition-colors">Stripe</a>

          <a href="/help" className="block text-white hover:text-blue-400 transition-colors">Help</a>
          {!user && (
            <a href="/signup" className="block text-white hover:text-blue-400 transition-colors">Sign Up</a>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full h-16 bg-[#121212] flex items-center justify-around px-custom">
        <a href="/" className="flex flex-col items-center">
          <Home className="w-6 h-6 text-white" />
          <span className="text-xs text-white mt-1">Home</span>
        </a>
        <a href="/messaging" className="flex flex-col items-center">
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="text-xs text-white mt-1">Messages</span>
        </a>
        <a href="/request" className="flex flex-col items-center">
          <PlusSquare className="w-6 h-6 text-white" />
          <span className="text-xs text-white mt-1">Post</span>
        </a>
        <a href="/dash" className="flex flex-col items-center">
          <LayoutDashboard className="w-6 h-6 text-white" />
          <span className="text-xs text-white mt-1">Dashboard</span>
        </a>

        <a href={user ? `/profile/${username}` : "/login"} className="flex flex-col items-center">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
          <span className="text-xs text-white mt-1">You</span>
        </a>
      </div>
    </>
  );
}