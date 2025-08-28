'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabaseClient } from '../../../../utils/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabaseClient.auth.getSession()

      if (error) {
        console.error('Auth callback error:', error)
        router.push('/login?error=auth_failed')
        return
      }

      if (data.session?.user) {
        const userId = data.session.user.id
        console.log('User ID from callback:', userId)

        // Check if user has onboarded
        const checkHasOnboarded = async (id: string) => {
          const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', id)
          if (error) {
            console.error(error)
          }
          return data?.[0]?.has_onboarded || false
        }

        const hasOnboarded = await checkHasOnboarded(userId)

        if (hasOnboarded) {
          router.push('/')
        } else {
          router.push('/onboarding')
        }
      } else {
        // No session found
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  )
} 