import { Review } from '../../../types/Types';
import ReviewCard from './ReviewCard';

interface ReviewTableProps {
  reviews: Review[];
}

export default function ReviewTable({ reviews }: ReviewTableProps) {

  return (
    <div className="px-custom py-custom">
      {reviews.map((review, index) => (
        <ReviewCard key={index} userImage={review.userImage} userName={review.userName} reviewText={review.reviewText} rating={review.rating} date={review.date} />
      ))}
    </div>
  )
}