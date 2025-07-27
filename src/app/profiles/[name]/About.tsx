"use client"
import { useState } from "react";
import Overlay from "./Overlay";

export default function About({ data }: {
  data: {
    image_url: string, biography: string, name: string, avg_reviews: number, linktree: string,
    commissions: { title: string, type: string, price: number, description: string, images: string[], thumbnail: string, delivery_days: number }[]
  }
}) {
  const { image_url, biography, name, avg_reviews, linktree, commissions } = data;
  const [showOverlay, setShowOverlay] = useState(false);
  function closeOverlay() {
    setShowOverlay(false);
  }
  return <div className="flex flex-col mt-4 w-full">
    <div className="flex flex-col sm:flex-row">
      <img
        src={image_url}
        width={80}
        height={80}
        style={{ borderRadius: '50%', objectFit: 'cover', width: 125, height: 125, border: '2px solid #ccc' }}
        className="self-center sm:self-start"
      />
      <div className="flex flex-col ml-0 sm:ml-4 mt-4 sm:mt-0 text-base justify-center space-y-1">
        <p>{name}</p>
        <p><span className="text-lg">&#9733;</span> {avg_reviews} <span className="text-base text-gray-500">(97 reviews)</span></p>
        <a href={linktree} className="text-blue-600 underline">linktree</a>
        <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-base w-fit" onClick={() => setShowOverlay(true)}>
          Commissions
        </button>
        {showOverlay && <Overlay data={commissions} close={closeOverlay} />}
      </div>
    </div>
    <div className="flex flex-col mt-4">
      <p className="font-bold text-lg">About me</p>
      <p className="w-full text-base break-words">{biography}</p>
    </div>
  </div>

}