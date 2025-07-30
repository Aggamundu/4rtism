export default function OverviewCard({ commissions, money, rating }: { commissions: number, money: number, rating: number }) {
  const renderStars = (rating: number) => {
    const roundedRating = Math.round(rating); // Round to nearest integer (up if >= 0.5, down if < 0.5)
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push('⭐');
      } else {
        stars.push('☆');
      }
    }

    return stars.join(' ');
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Total Commissions</h3>
          <p className="text-3xl font-bold text-blue-600">{commissions}</p>
          <p className="text-sm text-gray-500">+12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Total Earnings</h3>
          <p className="text-3xl font-bold text-green-600">{money}</p>
          <p className="text-sm text-gray-500">+8% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Average Rating</h3>
          <p className="text-3xl font-bold text-yellow-600">{rating}</p>
          <p className="text-sm text-gray-500">{renderStars(rating)}</p>
        </div>
      </div>
    </div>
  )
}