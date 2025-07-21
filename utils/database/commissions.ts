import { prisma } from '../prisma'
import { supabaseClient } from '../supabaseClient'

export async function createCommission(form: any) {
  try {

    const newCommission = await prisma.commissions.create({
      data: {
        title: form.title,
        type: form.type,
        price: form.price,
        description: form.description,
        profile_id: form.userId,
        images: form.images,
        thumbnail: form.thumbnail,
        delivery_days: form.delivery_days,
      },
    })
    console.log('✅ Commission created successfully:', newCommission)
    return newCommission
  } catch (error) {
    console.error('❌ Error creating commission:', error)
    throw error
  }
}