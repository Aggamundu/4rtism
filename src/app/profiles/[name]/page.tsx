import About from "./About"
import Commission from "./Commission"

export default async function ProfilePage({params}: {params: {name: string}}) {
  const {name} = params
  // const res = await fetch(`http://localhost:3000/api/profiles?name=${name}`)
  // const data = await res.json()
  // console.log(data)
  // const commissionsRes = await fetch(`http://localhost:3000/api/commissions?profileId=${data.id}`)
  // const commissionsData = await commissionsRes.json()
  // console.log(commissionsData)
  const data = {
    id: '0862d694-0bde-4991-8ef9-e89b984f4365',
    created_at: '2025-07-18T16:53:31.751Z',
    name: 'ryan',
    biography: 'Hi! I’m Alex, a digital artist with over 5 years of experience creating fantasy character illustrations, cozy environments, and stylized portraits. I love bringing people’s ideas to life with vibrant colors, emotional storytelling, and clean linework. Whether it’s a D&D character, a book cover, or a personalized gift, I’m excited to work with you to create something special.',
    image_url: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/146c9ff2-1096-4abe-a629-7bd74c080d93',
    avg_reviews: 4,
    linktree: 'https://linktree.com/test'
  }
  const commissionsData = [
    {
      title: 'Ryan',
      type: 'Cartoon Style',
      price: 33,
      description: '3',
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
      description: '3',
      images: [
        'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/de8b411b-e5b0-4a96-ad5a-69aaab472f37',
        'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/110a3d8b-a5aa-4c39-b6a8-3c15449ef124'
      ],
      thumbnail: 'https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/e1c959eb-6628-4881-b6d2-fb543113f7b9',
      delivery_days: 3
    }
  ]
  return <div>
    <About data={data} />
    <div className="flex flex-col">
      Commissions
      {commissionsData.map((commission: any, index: number) => (
        <Commission key={index} data={commission} />
      ))}
    </div>
  </div>
}