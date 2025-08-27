'use client'

import { useRouter } from 'next/navigation'
import { supabaseClient } from '../../../utils/supabaseClient'
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function OnboardingPage() {
  const [username, setUsername] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => {
    console.log(user)
    if (!loading && !user) {
      router.push('/home')
    } else if (!loading && user) {  
      setPageLoading(false)
      checkHasOnboarded()
    }
  }, [user, loading])

  const addEmailToUser = async (id: string, email: string) => {
    const { data, error } = await supabaseClient.from('emails').insert({ email: email, user_id: id })
    if (error) {
      console.error(error)
    }
  }

  const checkHasOnboarded = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single()
    if (data?.has_onboarded) {
      router.push('/help')
    } else {
      setPageLoading(false)
    }
  }

  const hasOnboarded = async () => {
    const {data, error} = await supabaseClient.from('profiles').update({ has_onboarded: true }).eq('id', user.id)
    if (error) {
      console.error(error)
      setError("Error updating onboarding status")
    }
  }

  const updateUsername = async () => {
    const { data, error } = await supabaseClient.from('profiles').update({ user_name: username }).eq('id', user.id)
    if (error) {
      console.error(error)
      setError("Username already exists")
    } else {
      router.push('/home')
    }
  }

  const disable = () => {
    if (username.length < 1 || pageLoading) {
      return true
    }
    return false
  }

  const handleContinue = () => {
    updateUsername()
    hasOnboarded()
    addEmailToUser(user.id, user.email)
  }

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null; // This will trigger the useEffect to redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col gap-4 mb-6 justify-center">
          <div className="h-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div>
            <p className="text-lg font-bold">Choose your username</p>
            <p className="text-sm text-custom-lightgray">You cannot change this later</p>
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-3 w-full p-3 bg-custom-darkgray border-2 border-white focus:bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none"
          />
           <button
                onClick={handleContinue}
                disabled={disable()}
                className="flex-1 bg-custom-blue hover:bg-custom-blue/90 text-custom-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                Continue
              </button>
        </div>
    </div>
  )
}
