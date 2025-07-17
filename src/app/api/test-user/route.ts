import { NextResponse } from 'next/server'
import { testCreateProfile } from '../../../../utils/database/users'

export async function POST() {
  try {
    const user = await testCreateProfile()
    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully',
      user 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 