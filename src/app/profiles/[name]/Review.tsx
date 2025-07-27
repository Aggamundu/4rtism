import ReviewType from "./ReviewType";

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));

  if (diffInMonths === 0) {
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) {
      return "Today";
    }
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
}

export default function Review({ review }: { review: ReviewType }) {

  const { id, created_at, reviewee, pfp_url, image, reviewer, comment, rating } = review;
  return (
    <div className="flex flex-col sm:flex-row text-base border w-full sm:w-[50%] border-gray-300 rounded-md pt-1 mt-2 justify-between">
      <div className="flex flex-col text-base rounded-md flex-1">
        <div className="flex flex-row items-center ">
          <img src={!pfp_url || pfp_url === '' ? "/blank_pfp.webp" : pfp_url} alt="blank pfp" className="ml-2 mr-3 w-6 h-6 rounded-full" />
          <p className="pb-1 text-sm sm:text-base">{reviewee} {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-xl mr-1 ${i < rating ? 'text-black-400' : 'text-gray-300'}`}
            >
              &#9733;
            </span>
          ))}{rating} • <span className="text-gray-500">{getTimeAgo(created_at)}</span></p>
        </div>
        <p className="text-base text-gray-500 ml-2">{comment}</p>
      </div>
      <img src={image} alt="review" className="w-full sm:w-[100px] sm:h-[120px] rounded-md object-cover object-center flex-shrink-0 mt-2 sm:mt-0" />
    </div>


  )
}