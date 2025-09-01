'use client'
import Header from '@/components/Header'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { supabaseClient } from '../../../utils/supabaseClient'

export default function ChangePasswordPage() {
  const [email, setEmail] = useState('')

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }

  const handleForgotPassword = async () => {
    await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `https://art-commission.vercel.app//change-password`
    })
    toast.success('Password reset link sent to email')
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-custom">
      <Header />
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          Enter your email to receive a password reset link
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full p-3 bg-custom-darkgray border-2 border-white focus:bg-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={handleForgotPassword}
          disabled={!isValidEmail(email)}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-4 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 active:scale-95 transition-all duration-200"
        >
          Reset Password
        </button>
      </div>


    </div>
  )
}