import { prisma } from '../prisma'

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

// export async function getExpensiveCommissions() {
//   const expensiveCommissions = await prisma.commissions.findMany({
//     orderBy: {
//       price: 'desc',
//     },
//     select: {
//       thumbnail: true,
//       delivery_days: true,
//       price: true,
//       profiles: {
//         select: {
//           name: true,
//           avg_reviews: true,
//         }
//       }
//     },
//   });
//   return expensiveCommissions;
// }