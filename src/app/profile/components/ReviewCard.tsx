export default function ReviewCard({ userImage, userName, reviewText, rating, date }: { userImage: string, userName: string, reviewText: string, rating: number, date: string }) {

  const renderStars = (rating: number) => {
    const stars = [];
    const totalStars = 5;

    for (let i = 1; i <= totalStars; i++) {
      if (i <= rating) {
        // Filled star
        stars.push(
          <svg key={i} className="w-4 h-4 text-custom-yellow" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        // Empty star
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }

    return stars;
  };

  return (
    <div className="flex flex-col rounded-card bg-custom-gray shadow-lg px-custom px-custom py-[1.5rem] sm:w-[70%] w-full">
      <div className="flex flex-row gap-x-2">
        <img src={userImage} alt="User" className="w-[24px] h-[24px] rounded-full" />
        <p className="text-base text-white font-bold">{userName}</p>
        <p className="text-base text-custom-lightgray font-bold">{date}</p>
      </div>
      <div className="flex items-center gap-x-1 my-2">
        {renderStars(rating)}
      </div>
      <p className="text-base text-custom-lightgray">{reviewText}</p>
    </div>
  )
}