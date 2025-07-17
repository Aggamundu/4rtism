'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<'client' | 'artist' | null>(null)
  const router = useRouter()

  const handleSubmit = () => {
    if (!selectedRole) {
      alert('Please select a role')
      return
    }

    if (selectedRole === 'artist') {
      router.push('/artist-onboarding')
      return
    }

    console.log('Selected role:', selectedRole)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Choose Your Role</h1>
        <div className="flex gap-4 mb-6 justify-center">
          <label
            className={`w-40 py-3 px-4 border-2 rounded-lg transition-all text-sm cursor-pointer relative ${selectedRole === 'client'
              ? 'border-red-500 bg-red-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            {selectedRole === 'client' && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <input
              type="checkbox"
              className="sr-only"
              checked={selectedRole === 'client'}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRole('client')
                } else if (selectedRole === 'client') {
                  setSelectedRole(null)
                }
              }}
            />
            <h3 className="font-semibold">Client</h3>
            <p className="text-gray-600 text-xs mt-1">
              I want to find and book artists
            </p>
          </label>

          <label
            className={`w-40 py-3 px-4 border-2 rounded-lg transition-all text-sm cursor-pointer relative ${selectedRole === 'artist'
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            {selectedRole === 'artist' && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <input
              type="checkbox"
              className="sr-only"
              checked={selectedRole === 'artist'}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRole('artist')
                } else if (selectedRole === 'artist') {
                  setSelectedRole(null)
                }
              }}
            />
            <h3 className="font-semibold">Artist</h3>
            <p className="text-gray-600 text-xs mt-1">
              I want to offer my services
            </p>
          </label>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedRole}
            className={`w-48 py-2 px-4 rounded-lg transition-all ${selectedRole
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
