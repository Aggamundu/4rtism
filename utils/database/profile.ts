import { prisma } from '../prisma'

export async function createProfile(userId: string) {
  try {
    const newProfile = await prisma.profiles.create({
      data: {
        id: userId, // Use the auth user's ID as the profile ID
        name: 'Test Profile',
        biography: 'test biography',
        image_url: 'https://example.com/profile.jpg',
      },
    })
    console.log('✅ Profile created successfully:', newProfile)
    return newProfile
  } catch (error) {
    console.error('❌ Error creating profile:', error)
    throw error
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  createProfile('test-user-id-123')
    .then(() => {
      console.log('Test completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Test failed:', error)
      process.exit(1)
    })
}

export async function getProfileByName(name: string) {
  const profile = await prisma.profiles.findUnique({
    where: {
      name: name,
    },
  })
  return profile
}