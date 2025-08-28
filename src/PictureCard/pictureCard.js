import "./pictureCard.css";
export default function PictureCard({ pic }) {

    return (
        <div className="card-container">
            <img className="card-img rounded-card" src={ pic } alt="" />
        </div>
    )
}

