'use client'

import { useEffect, useState } from "react";
import HomepageCard from "../../PictureCard/pictureCard.js";
import "./homepage.css";

export default function Homepage({ pictures }: { pictures: string[] }) {
  const [pictureCards, setPictureCards] = useState<React.ReactElement[]>([]);


  const loadPictures = () => {
    console.log("pictures", pictures);
    if (pictures) {
      setPictureCards(pictures.map((data, index) =>
      (
        <HomepageCard key={index} pic={data} />
      )
      ))
    }
  };

  useEffect(() => {
    loadPictures();
  }, []);

  return (
    <div className="homepage-container">
      <div className="homepage-explore-container px-custom">
        {pictureCards}
      </div>
    </div>
  )
}

