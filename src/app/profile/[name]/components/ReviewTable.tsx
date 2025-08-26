import { Review } from '../../../types/Types';
import ReviewCard from './ReviewCard';

interface ReviewTableProps {
  reviews: Review[];
}

export default function ReviewTable({ reviews }: ReviewTableProps) {

  return (
    <div className="px-custom py-6">
      {reviews.map((review, index) => (
        <ReviewCard key={index} userName={review.userName} reviewText={review.reviewText} rating={review.rating} date={review.date} />
      ))}
    </div>
  )
}