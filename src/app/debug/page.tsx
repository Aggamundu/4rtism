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
      // Add public URLs to each media item
      const mediaWithUrls = data.map(item => ({
        ...item,
        publicUrl: supabaseClient.storage
          .from('commissions')
          .getPublicUrl(userId + "/" + item.name).data.publicUrl
      }))
      setMedia(mediaWithUrls)
    } else {
      console.log(71, error)
    }
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0]
    if (!file) return

    const filePath = userId + "/" + uuidv4()
    const { data, error } = await supabaseClient
      .storage
      .from('commissions')
      .upload(filePath, file)

    if (data) {
      // Get the public URL of the uploaded image
      const { data: urlData } = supabaseClient
        .storage
        .from('commissions')
        .getPublicUrl(filePath)

      console.log('Image URL:', urlData.publicUrl)
      alert(`Image uploaded successfully! URL: ${urlData.publicUrl}`)
      getMedia();
    }

    if (error) {
      alert(error.message)
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
      <input type="file" onChange={(e) => uploadImage(e)} />
      <div className="flex flex-wrap gap-2">
        My Uploads:
        {media.map((media) => {
          return (
            <div key={media.name} className="w-32 h-32 overflow-hidden border rounded">
              <img
                src={media.publicUrl}
                className="w-full h-full object-cover"
                alt={media.name}
              />
              <div className="text-xs p-1 truncate">
                {media.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
