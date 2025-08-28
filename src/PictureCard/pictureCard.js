import "./pictureCard.css";
import { Image } from "next/image";
export default function PictureCard({ pic }) {

    return (
        <div className="card-container">
            <Image className="card-img rounded-card" src={ pic } alt="" />
        </div>
    )
}

