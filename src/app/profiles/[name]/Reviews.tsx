"use client"
import { useState } from 'react';
import Review from './Review';
import ReviewType from './ReviewType';
import Stars from './Stars';

export default function Reviews({ reviews }: { reviews: ReviewType[] }) {
  const [sort, setSort] = useState<'highest' | 'lowest'>('highest');
  const [showCount, setShowCount] = useState(2);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === 'highest') {
      return b.rating - a.rating;
    } else {
      return a.rating - b.rating;
    }
  });

  const displayedReviews = sortedReviews.slice(0, showCount);
  const hasMore = showCount < sortedReviews.length;

  return (
    <div className="text-base">

      <Stars stars={5} percentage={0.8} numReviews={10} />
      <Stars stars={4} percentage={0.2} numReviews={10} />
      <Stars stars={3} percentage={0} numReviews={0} />
      <Stars stars={2} percentage={0} numReviews={0} />
      <Stars stars={1} percentage={0} numReviews={0} />
      <div className="flex items-center mb-.5 mt-2">
        <p className="mr-2">Sort by:</p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'highest' | 'lowest')}
          className="border border-gray-300 rounded-md px-2"
        >
          <option value="highest">Highest Reviews</option>
          <option value="lowest">Lowest Reviews</option>
        </select>
      </div>
      {displayedReviews.map((review, index) => (
        <Review key={review.id || index} review={review} />
      ))}
      <div className="w-full sm:w-[50%] flex flex-row justify-end space-x-4">
        {showCount > 2 && (
          <div className="flex justify-end mt-1">
            <button
              onClick={() => setShowCount(2)}
              className="text-black underline hover:text-blue-600 transition-colors"
            >
              Show Less
            </button>
          </div>
        )}
        {hasMore && (
          <div className="flex justify-end mt-1">
            <button
              onClick={() => setShowCount(showCount + 2)}
              className="text-black underline hover:text-blue-600 transition-colors"
            >
              Show More
            </button>
          </div>
        )}

      </div>

    </div>
  )
}