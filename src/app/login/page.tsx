'use client'

import { useState } from 'react'
import { supabaseClient } from '../../../utils/supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    setLoading(true)
    const { data, error } = await supabaseClient.auth.signUp({ email, password })
    setLoading(false)
    if (error) alert(error.message)
    else alert('Check your email for confirmation!')
  }

  const handleLogin = async () => {
    setLoading(true)
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      alert(error.message)
    } else {
      // Redirect to profile creation page after successful login
      window.location.href = '/create-profile'
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <button onClick={handleLogin} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
        <button onClick={handleSignUp} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded">
          Sign Up
        </button>
      </div>
    </div>
  )
}
