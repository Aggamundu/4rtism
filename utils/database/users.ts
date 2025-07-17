import { prisma } from '../prisma'

// Test function to create a user
export async function testCreateProfile() {
  try {
    const user = await prisma.profiles.create({
      data: {
        id: 'f53a705e-ba38-45e2-b2a9-9438ed80e38a',
        username: 'test',
        display_name: 'Test User',
        bio: 'Test bio',
        profile_image_url: 'https://example.com/profile.jpg',
        phone_verified: false,
      },
    })
    console.log('✅ User created successfully:', user)
    return user
  } catch (error) {
    console.error('❌ Error creating user:', error)
    throw error
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testCreateProfile()
    .then(() => {
      console.log('Test completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Test failed:', error)
      process.exit(1)
    })
}