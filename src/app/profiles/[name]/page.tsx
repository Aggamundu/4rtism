import Footer from "@/components/Footer"
import Header from "@/components/Header"
import About from "./About"
import Reviews from "./Reviews"

export default async function ProfilePage({ params }: { params: { name: string } }) {
  const { name } = params
  // const res = await fetch(`http://localhost:3000/api/profiles?name=${name}`)
  // const data = await res.json()
  // console.log(data)
  // const commissionsRes = await fetch(`http://localhost:3000/api/commissions?profileId=${data.id}`)
  // const commissionsData = await commissionsRes.json()
  // console.log(commissionsData)

  const commissionsData = [
    {
      title: 'Ryan',
      type: 'Cartoon Style',
      price: 33,
      description: `character designs or concept art of your OC/existent character in my personal artstyle based on your description and references.
• I will give you the opportunity to always see EACH STEP of the process (sketch, lineart and colors)
• Too complicated revisions will not be made when the work is already finished (colors changes are ok)
• Please pay attention to the sketch and let me know first the corrections/additions to be made
• Distractions or forgetfulness will not be tolerated!`,
      images: [
        'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/fa35cf6c-04b8-40fe-bbac-ac91f0f39846',
        'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/89377a2d-be1e-4390-b6df-d5308bf62895'
      ],
      thumbnail: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/3c17335a-dcc0-4eb8-8474-7c7521f41fb5',
      delivery_days: 3,
    },
    {
      title: 'Ryan',
      type: 'Cartoon Style',
      price: 33,
      description: `charac`,
      images: [
        'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/fa35cf6c-04b8-40fe-bbac-ac91f0f39846',
        'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/89377a2d-be1e-4390-b6df-d5308bf62895'
      ],
      thumbnail: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/3c17335a-dcc0-4eb8-8474-7c7521f41fb5',
      delivery_days: 3,
    },
    {
      title: 'Ryan',
      type: 'Cartoon Style',
      price: 33,
      description: `charac`,
      images: [
        'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/fa35cf6c-04b8-40fe-bbac-ac91f0f39846',
        'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/89377a2d-be1e-4390-b6df-d5308bf62895'
      ],
      thumbnail: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/3c17335a-dcc0-4eb8-8474-7c7521f41fb5',
      delivery_days: 3,
    },
  ]

  const reviews = [
    {
      id: 1,
      created_at: '2025-07-18T16:53:31.751Z',
      reviewee: 'Ryan',
      pfp_url: '',
      image: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/146c9ff2-1096-4abe-a629-7bd74c080d93',
      reviewer: 'John Doe',
      comment: 'Great work!',
      rating: 5,
    },
    {
      id: 2,
      created_at: '2025-07-18T16:53:31.751Z',
      reviewee: 'Ryan',
      pfp_url: '',
      image: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/146c9ff2-1096-4abe-a629-7bd74c080d93',
      reviewer: 'John Doe',
      comment: 'Great work!',
      rating: 3,
    },
    {
      id: 3,
      created_at: '2025-06-15T10:30:00.000Z',
      reviewee: 'Ryan',
      pfp_url: '',
      image: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/146c9ff2-1096-4abe-a629-7bd74c080d93',
      reviewer: 'Sarah Wilson',
      comment: 'Absolutely amazing artwork! The attention to detail is incredible. Will definitely order again.',
      rating: 5,
    },
    {
      id: 4,
      created_at: '2025-05-20T14:22:15.000Z',
      reviewee: 'Ryan',
      pfp_url: '',
      image: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/146c9ff2-1096-4abe-a629-7bd74c080d93',
      reviewer: 'Mike Chen',
      comment: 'Good quality work, but took longer than expected. Communication was decent.',
      rating: 4,
    },
    {
      id: 5,
      created_at: '2025-04-10T09:15:30.000Z',
      reviewee: 'Ryan',
      pfp_url: '',
      image: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/146c9ff2-1096-4abe-a629-7bd74c080d93',
      reviewer: 'Emma Rodriguez',
      comment: 'The artwork exceeded my expectations! Perfect for my project. Highly recommend!',
      rating: 5,
    },
    {
      id: 6,
      created_at: '2025-03-25T16:45:00.000Z',
      reviewee: 'Ryan',
      pfp_url: '',
      image: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/146c9ff2-1096-4abe-a629-7bd74c080d93',
      reviewer: 'David Thompson',
      comment: 'Average work. Could be better for the price. Not terrible though.',
      rating: 3,
    },
    {
      id: 7,
      created_at: '2025-02-12T11:20:45.000Z',
      reviewee: 'Ryan',
      pfp_url: '',
      image: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/146c9ff2-1096-4abe-a629-7bd74c080d93',
      reviewer: 'Lisa Park',
      comment: 'Fantastic artist! Very professional and delivered exactly what I wanted. Will be a returning customer!',
      rating: 5,
    },
  ]


  const data = {
    id: 2,
    created_at: '2025-07-18T16:53:31.751Z',
    name: 'ryan',
    biography: 'Hi! I’m Alex, a digital artist with over 5 years of experience creating fantasy character illustrations, cozy environments, and stylized portraits. I love bringing people’s ideas to life with vibrant colors, emotional storytelling, and clean linework. Whether it’s a D&D character, a book cover, or a personalized gift, I’m excited to work with you to create something special.',
    image_url: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/146c9ff2-1096-4abe-a629-7bd74c080d93',
    avg_reviews: 4.5,
    linktree: 'https://linktree.com/test',
    commissions: commissionsData
  }
  return <div className="min-h-screen w-full overflow-x-hidden">
    <Header />
    <div className="max-w-full px-4 md:px-8">
      <About data={data} />
      <div className="text-lg font-bold mt-4">Portfolio</div>
      <div className="text-lg font-bold mt-4">Reviews</div>
      <Reviews reviews={reviews} />
      <div className="text-lg font-bold mt-4">Terms of Service</div>
      <div className="text-base whitespace-pre-wrap">
        {`[IMPORTANT NOTICE! copyright and credits will always belong to me.
original characters, stories etc, are your invention so it belongs to you, but the illustration itself is uder my name.
it is strictly forbidden to use my work for commercial purposes without authorization and purchased the commercial use!]`}
      </div>
    </div>
    <Footer />
  </div>
}