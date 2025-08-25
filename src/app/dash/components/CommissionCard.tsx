import { formatDateTime } from "../../../utils/dateFormatter";
import { CommissionRequest } from "../../types/Types";
import StatusPayment from "./StatusPayment";

interface CommissionRequestCardProps {
  commission: CommissionRequest;
  onCardClick: (commission: any) => void;
}

export default function CommissionCard({ commission, onCardClick }: CommissionRequestCardProps) {
  const { status, payment, client_email, submitted, confirmed } = commission;

  return (
    <div
      className="flex flex-row bg-white text-sm text-black rounded-card items-center justify-evenly py-[1%] px-4 cursor-pointer hover:bg-gray-50"
      onClick={() => onCardClick(commission)}
    >
      <div className="flex-1 flex items-center justify-center min-w-[100px]">
        <StatusPayment name={status} />
      </div>
      <div className="flex-1 flex justify-center items-center min-w-[100px]">
        <StatusPayment name={payment} />
      </div>
      <div className="flex-1 text-center min-w-[120px]">
        <div>{formatDateTime(submitted)?.date || 'N/A'}</div>
        <div className="text-custom-lightgray">{formatDateTime(submitted)?.time || ''}</div>
      </div>
      <div className="flex-1 text-center min-w-[120px]">
        <div>{formatDateTime(confirmed)?.date || 'N/A'}</div>
        <div className="text-custom-lightgray">{formatDateTime(confirmed)?.time || ''}</div>
      </div>
      <div className="flex-1 text-center min-w-[220px]">
        <div>{client_email}</div>
      </div>
    </div>
  )
}