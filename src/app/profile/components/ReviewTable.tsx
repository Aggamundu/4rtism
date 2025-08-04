import ReviewCard from './ReviewCard';

export default function ReviewTable() {
  const reviews = [
    {
      userImage: "/images/kai.png",
      userName: "Kaito",
      reviewText: "This is a review",
      rating: 5,
      date: "2021-01-01"
    }
  ]
    return (
        <div className = "px-custom">
            {reviews.map((review, index) => (
                <ReviewCard key={index} userImage={review.userImage} userName={review.userName} reviewText={review.reviewText} rating={review.rating} date={review.date} />
            ))}
        </div>
    )
}