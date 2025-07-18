'use client'

import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { supabaseClient } from '../../../utils/supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [media, setMedia] = useState<any[]>([])
  
  const testAuth = async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    setUserId(user?.id as string)
    if (!userId) {
      alert('No user found')
      return
    } else {
      alert('User found')
      alert(userId)
    }
  }

  const getMedia = async () => {
    const { data, error } = await supabaseClient
    .storage
    .from('commissions')
    .list(userId + "/", {
      limit: 10,
      offset: 0,
      sortBy: {
        column: 'name',
        order: 'asc',
      },
    })
    if (data) {
      setMedia(data)
    } else {
      console.log(71, error)
    }
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0]
    if (!file) return

    const { data, error } = await supabaseClient
    .storage
    .from('commissions')
    .upload(userId + "/" + uuidv4(), file)

    if (data) {
      getMedia();
    }

    if (error) {
      alert(error.message)
    } else {
      alert('Image uploaded successfully')
    }
  }

  const createCommission = async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const userId = user?.id;
    if (!userId) {
      alert('No user found')
      return
    } else {
      const res = await fetch("/api/commissions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
        }),
      })
      if (res.ok) {
        alert('Commission request sent successfully!')
      } else {
        alert('Error sending commission request')
      }
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    const { data, error } = await supabaseClient.auth.signUp({ email, password })
    if (data?.user?.id) {
      const res = await fetch("https://fvfkrsqxbxzbwiojvghz.supabase.co/functions/v1/swift-action", {
        method: 'POST',
        body: JSON.stringify({
          action: 'create-profile',
          user_id: data.user.id,
        }),
      })
      console.log(data)
    }
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
      alert('Login successful')
    }
  }
  useEffect(() => {
    getMedia()
  }, [userId])
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
      <button onClick={createCommission} disabled={loading} className="bg-purple-500 text-white px-4 py-2 rounded">
        Create Commission
      </button>
      <button onClick={testAuth} disabled={loading} className="bg-purple-500 text-white px-4 py-2 rounded">
        Test Auth
      </button>
      <input type="file" onChange = {(e) => uploadImage(e)} />
      <div>
        My Uploads:
      </div>

      {media.map((media) => {
        return (
          <div>
            <img src={`https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/${media.name}`}/>
            {/* https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365 */}
          </div>
        )
      })}
    </div>
  )
}
