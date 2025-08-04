import "./pictureCard.css";

export default function PictureCard({ pic, title }) {

    return (
        <div className="card-container">
            <img className="card-img rounded-card" src={ pic } />
            <div className="card-title text-base">{ title }</div>
        </div>
    )
}

