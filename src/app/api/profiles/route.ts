import { NextRequest, NextResponse } from 'next/server'
import { createProfile } from '../../../../utils/database/profile'
import { getProfileByName } from '../../../../utils/database/profile'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const profile = await createProfile(userId)
    
    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
} 

export async function GET(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get('name')
    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      )
    }
    const profile = await getProfileByName(name)
    return NextResponse.json(profile, { status: 200 })
  } catch (error) {
    console.error('Error getting profile:', error)
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}