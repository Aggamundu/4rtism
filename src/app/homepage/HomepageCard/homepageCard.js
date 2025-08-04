import "./homepageCard.css";

export default function HomepageCard({ pic, picAlt, title }) {

    return (
        <div className="card-container">
            <img className="card-img" src={ pic } alt={ picAlt } />
            <div className="card-title">{ title }</div>
        </div>
    )
}

