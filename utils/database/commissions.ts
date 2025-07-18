import { prisma } from '../prisma'
import { supabaseClient } from '../supabaseClient'

export async function createCommission(userId: string) {
  try {

    const newCommission = await prisma.commissions.create({
      data: {
        title: 'Test Commission',
        type: 'semi-realistic',
        price: 100,
        description: 'Test description',
        profile_id: userId,
      },
    })
    console.log('✅ Commission created successfully:', newCommission)
    return newCommission
  } catch (error) {
    console.error('❌ Error creating commission:', error)
    throw error
  }
}