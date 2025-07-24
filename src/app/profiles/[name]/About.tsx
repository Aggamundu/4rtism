export default function About({ data }: { data: { image_url: string, biography: string,name: string, avg_reviews: number, linktree: string } }) {
  const { image_url, biography, name, avg_reviews, linktree } = data;
  return <div className="flex flex-col mt-4">
    <div className="flex flex-row">
      <img
        src={image_url}
        width={100}
        height={100}
        style={{ borderRadius: '50%', objectFit: 'cover', width: 125, height: 125, border: '2px solid #ccc' }}
      />
      <div className="flex flex-col ml-4 text-base">
        <p>{name}</p>
        <p><span className="">&#9733;</span> {/* Black Star: ★ */} <span className="text-red-500">&#9829;</span> {/* Black Heart: ♥ */}{avg_reviews}</p>
        <a href={linktree}>Socials</a>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Work Queue
        </button>
      </div>
    </div>
    <div className="flex flex-col mt-4">
      <p className="font-bold text-lg">About me</p>
      <p className="w-[80%] text-base">{biography}</p>
    </div>
  </div>

}