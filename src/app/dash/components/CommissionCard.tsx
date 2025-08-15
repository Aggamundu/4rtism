import StatusPayment from "./StatusPayment";
import { CommissionRequest } from "../../types/Types";

interface CommissionRequestCardProps {
  commission: CommissionRequest;
  onCardClick: (commission: any) => void;
}

export default function CommissionCard({ commission, onCardClick }: CommissionRequestCardProps) {
  const { status, payment, commission_title, submitted, confirmed, client } = commission;

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
        <div>{commission_title}</div>
      </div>
    </div>
  )
}