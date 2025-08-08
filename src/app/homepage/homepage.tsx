'use client'

import { useEffect, useState } from "react";
import HomepageCard from "../../PictureCard/pictureCard.js";
import { Picture } from "../types/Types.jsx";
import "./homepage.css";

export default function Homepage({ pictures }: { pictures: Picture[] }) {
  const [pictureCards, setPictureCards] = useState<React.ReactElement[]>([]);


  const loadHardCodedPictures = () => {
    setPictureCards(pictures.map((data, index) =>
    (
      <HomepageCard key={index} pic={data.pic} title={data.title} />
    ))
    );
  };

  useEffect(() => {
    loadHardCodedPictures();
  }, []);

  return (
    <div className="homepage-container">
      <div className="homepage-explore-container px-custom">
        {pictureCards}
      </div>
    </div>
  )
}

