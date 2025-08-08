import ReviewCard from './ReviewCard';

export default function ReviewTable() {
  const reviews = [
    {
      userImage: "/images/kai.png",
      userName: "Kaito",
      reviewText: "This is a review",
      rating: 4,
      date: "2021-01-01"
    },
    {
      userImage: "/images/kai2.png",
      userName: "Sarah",
      reviewText: "Amazing work! The artist really captured what I was looking for. Highly recommend!",
      rating: 5,
      date: "2023-12-15"
    },
    {
      userImage: "/images/kai3.png",
      userName: "Mike",
      reviewText: "Great communication throughout the process. The final piece exceeded my expectations.",
      rating: 5,
      date: "2023-11-28"
    },
    {
      userImage: "/images/kai.png",
      userName: "Emma",
      reviewText: "Very talented artist. The commission turned out exactly as I envisioned.",
      rating: 4,
      date: "2023-10-12"
    },
    {
      userImage: "/images/kai2.png",
      userName: "David",
      reviewText: "Professional and timely delivery. Would definitely commission again!",
      rating: 5,
      date: "2023-09-20"
    },
    {
      userImage: "/images/kai3.png",
      userName: "Lisa",
      reviewText: "Good quality work, though it took a bit longer than expected.",
      rating: 3,
      date: "2023-08-05"
    },
    {
      userImage: "/images/kai.png",
      userName: "Alex",
      reviewText: "Incredible attention to detail. The artist really brought my idea to life!",
      rating: 5,
      date: "2023-07-18"
    },
    {
      userImage: "/images/kai2.png",
      userName: "Jordan",
      reviewText: "Solid work, good value for the price. Happy with the result.",
      rating: 4,
      date: "2023-06-30"
    }
  ];
  return (
    <div className="px-custom">
      {reviews.map((review, index) => (
        <ReviewCard key={index} userImage={review.userImage} userName={review.userName} reviewText={review.reviewText} rating={review.rating} date={review.date} />
      ))}
    </div>
  )
}