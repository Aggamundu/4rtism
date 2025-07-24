import { createCommission } from '../../../../utils/database/commissions'
import { NextRequest, NextResponse } from 'next/server'
import { getCommissionsByProfileId } from '../../../../utils/database/commissions'

export async function POST(request: NextRequest) {
  try {
    const form = await request.json()
    const commission = await createCommission(form)
    const safeCommission = {
      id: commission.id.toString(),
      title: commission.title,
      type: commission.type,
      price: commission.price,
      description: commission.description,
      images: commission.images,
      thumbnail: commission.thumbnail,
      delivery_days: commission.delivery_days,
    }
    return NextResponse.json(safeCommission, { status: 201 })
  } catch (error) {
    console.error('Error creating commission:', error)
    return NextResponse.json(
      { error: 'Failed to create commission' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const profileId = request.nextUrl.searchParams.get('profileId')
    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      )
    }
    const commissions = await getCommissionsByProfileId(profileId)
    const commissionSafe = commissions.map((commission) => ({
      id: commission.id.toString(),
      title: commission.title,
      type: commission.type,
      price: commission.price,
      description: commission.description,
      images: commission.images,
      thumbnail: commission.thumbnail,
      delivery_days: commission.delivery_days,
    }))
    return NextResponse.json(commissionSafe, { status: 200 })
  } catch (error) {
    console.error('Error getting commissions:', error)
    return NextResponse.json(
      { error: 'Failed to get commissions' },
      { status: 500 }
    )
  }
}