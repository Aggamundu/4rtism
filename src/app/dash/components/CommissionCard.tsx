import StatusPayment from "./StatusPayment";

interface CommissionCardProps {
  status: string;
  payment: string;
  title: string;
  submitted: string;
  confirmed: string;
  client: string;
  onCardClick: (commission: any) => void;
}

export default function CommissionCard({ status, payment, title, submitted, confirmed, client, onCardClick }: CommissionCardProps) {
  const commission = { status, payment, title, submitted, confirmed, client };

  return (
    <div
      className="flex flex-row bg-white text-sm text-black rounded-card items-center justify-evenly py-[1%] px-4 cursor-pointer hover:bg-gray-50"
      onClick={() => onCardClick(commission)}
    >
      <div className="flex-1 flex items-center justify-center">
        <StatusPayment name={status} />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <StatusPayment name={payment} />
      </div>
      <div className="flex-1 text-center">
        <div>{submitted}</div>
        <div className="text-custom-lightgray">3:24 PM</div>
      </div>
      <div className="flex-1 text-center">
        <div>{confirmed ? confirmed : "N/A"}</div>
        <div className="text-custom-lightgray">3:24 PM</div>
      </div>
      <div className="flex-1 text-center">
        <div>{client}</div>
        <div>{title}</div>
      </div>
      <div className="w-8 flex justify-center">
        <button className="bg-custom-gray w-8 h-8 justify-center text-white rounded-full hover:bg-opacity-80 transition-all flex items-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    </div>
  )
}