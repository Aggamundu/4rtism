'use client'
import { useEffect, useState } from 'react'
import { supabaseClient } from '../../../utils/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import { toast } from 'react-hot-toast'

export default function ChangePasswordPage() {

  const { user, loading } = useAuth()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  useEffect(() => {
    if (!loading && !user) {
      router.push('/home')
    }
  }, [user, loading])

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null; // This will trigger the useEffect to redirect
  }

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    const { data, error } = await supabaseClient.auth.updateUser({ password: password })
    if (error) {
      toast.error(error.message)
    } else {
      router.push('/login')
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-custom">
      <Header />
      <div className="w-full max-w-md space-y-4">
      <div className="text-center">
          Enter your new password
      </div>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 bg-custom-darkgray border-2 border-white focus:bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none"
      />  
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-3 bg-custom-darkgray border-2 border-white focus:bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none"
      />  
      <button
        onClick={handleChangePassword}
        disabled={(password !== confirmPassword) || password.length < 6}
        className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 active:scale-95 transition-all duration-200"
      >
        Change Password
      </button>
      </div>
    </div>
  )
}