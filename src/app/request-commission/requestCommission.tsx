"use client"
import React, { useEffect, useRef, useState } from "react";
import PictureCard from "../../PictureCard/pictureCard";
import FormText from "../form-components/formText";
import { Commission } from "../types/Types";
import "./requestCommission.css";

export default function requestCommission({ isOpen, onClose, commission }: { isOpen: boolean, onClose: () => void, commission: Commission }) {
  const [pictures, setPictures] = useState<React.JSX.Element[]>([]);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  const hardCodedPicturesData = [
    { pic: "https://fvfkrsqxbxzbwiojvghz.supabase.co/storage/v1/object/public/commissions/0862d694-0bde-4991-8ef9-e89b984f4365/34384bd7-234e-4c32-84ca-ffa3da7b615b", picAlt: "massive" },
    { pic: "https://i.pinimg.com/736x/6b/81/79/6b81790629162af5b7d7983d73605b00.jpg", picAlt: "alsoProbRyan" },
    { pic: "https://i.pinimg.com/1200x/96/37/28/963728865be6c2751c9d478b7e113fc3.jpg", picAlt: "alsoRyan" },
    { pic: "https://i.pinimg.com/736x/c2/94/68/c29468ee05b49dc7de2966bab9d5371b.jpg", picAlt: "avacado" },
    { pic: "https://i.pinimg.com/736x/2d/59/7f/2d597fb039129f26b9548325eb821897.jpg", picAlt: "bakafood" },
    { pic: "https://i.pinimg.com/736x/e0/e2/be/e0e2be08f10bd0a9162cd9b4b3f0e8b9.jpg", picAlt: "bestPic" },
    { pic: "https://i.pinimg.com/736x/fc/5c/69/fc5c6921eeb724b1f437948413849919.jpg", picAlt: "cat" },
    { pic: "https://i.pinimg.com/736x/19/b6/46/19b646aefe22c74234f44eec71324364.jpg", picAlt: "egics" },
    { pic: "https://i.pinimg.com/1200x/47/97/f2/4797f2d620824ea09bced6335d9f4d46.jpg", picAlt: "notReallyArt" },
    { pic: "https://i.pinimg.com/736x/b9/5e/ad/b95eadd604ff8c34bf3c136941aa963f.jpg", picAlt: "notRyan" },
    { pic: "https://i.pinimg.com/736x/db/39/31/db39313d91f66e72c3d00149e50c6835.jpg", picAlt: "person" },
    { pic: "https://i.pinimg.com/1200x/81/51/f3/8151f333b41f9e6f980cfb0667dcd6c9.jpg", picAlt: "realisticPerson" },
    { pic: "https://i.pinimg.com/736x/ee/e9/f2/eee9f23c354d09638b059aa1b4ec7dca.jpg", picAlt: "ryan" },
    { pic: "https://i.pinimg.com/736x/42/d8/3d/42d83dfa2c4b1f0c89db1cb77e947db5.jpg", picAlt: "starryCat" },
    { pic: "https://i.pinimg.com/736x/d7/e2/0f/d7e20fa977d08ae9ec1c9c5e4840ba3e.jpg", picAlt: "stillLife" },
    { pic: "https://i.pinimg.com/736x/dd/51/33/dd51336145b530ac944772be6e3b0cc7.jpg", picAlt: "sunsetAnimeGirl" }
  ];

  const loadHardCodedPictures = () => {
    setPictures(hardCodedPicturesData.map((data, index) =>
    (
      <PictureCard key={index} pic={data.pic} title={data.picAlt} />
    ))
    );
  };

  useEffect(() => {
    loadHardCodedPictures();
  }, []);

  useEffect(() => {
    function syncHeight() {
      if (rightRef.current && leftRef.current) {
        const rightHeight = rightRef.current.offsetHeight;
        leftRef.current.style.height = `${rightHeight}px`;
      }
    }

    syncHeight(); // On mount
    window.addEventListener("resize", syncHeight); // On resize

    return () => window.removeEventListener("resize", syncHeight);
  }, [pictures]); // re-sync after pictures render

  return (
    <div className="request-commissions-container p-custom">
      <div id="left" className="request-commissions-left" ref={leftRef}>
        <div className="request-commissions-picture-container">
          {pictures}
        </div>
      </div>
      <div id="right" className="request-commissions-right" ref={rightRef}>
        <div className="request-commissions-title">
          Request Commission
        </div>
        <div className="request-commissions-form-container">
          <div className="request-commissions-form-card">
            <FormText
              label={"Request Details"}
              placeholder={"idk what this is"}
              errorStatus={false}
              successStatus={false}
              helperText={"TTTTTT"}
              charLimit={0}
            />
          </div>
          <div className="request-commissions-form-card">
            <FormText
              label={"Smth"}
              placeholder={"idk what this is"}
              errorStatus={false}
              successStatus={true}
              helperText={"good/10"}
              charLimit={50}
            />
          </div>
          <div className="request-commissions-form-card">
            <FormText
              label={"Smth"}
              placeholder={"idk what this is"}
              errorStatus={true}
              successStatus={false}
              helperText={"get better at steve"}
              charLimit={50}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

