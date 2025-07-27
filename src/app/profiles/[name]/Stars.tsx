export default function Stars({ stars, percentage, numReviews }: { stars: number, percentage: number, numReviews: number }) {
  return (
    <div className="text-base mr-1 flex items-center h-5">
      <p>{stars} stars {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-xl mr-1 ${i < stars ? 'text-black-400' : 'text-gray-300'}`}
        >
          &#9733;
        </span>
      ))}</p>
      <div className="w-[100px] h-[4px] bg-gray-200 ml-2 mt-1 rounded-full">
        <div
          className="h-full bg-black rounded-full"
          style={{ width: `${percentage * 100}%` }}
        />
      </div>
      <p className="text-base text-gray-500 ml-2">({numReviews})</p>
    </div>
  )
}