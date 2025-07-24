import "./requestDetails.css";

export default function HomepageCard({ pic, picAlt }) {

    return (
        <div className="card-container">
            <img className="card-img" src={ pic } alt={ picAlt } />
        </div>
    )
}

