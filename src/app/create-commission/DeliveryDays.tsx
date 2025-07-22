import { FormProps, Form } from "./FormTypes";
export default function DeliveryDays(props: FormProps) {
  const { form, setForm } = props;

  return (
    <div className="flex flex-row mb-[20px] gap-8 items-start justify-start">
    <div className="flex flex-col w-[230px]">
      <p className="text-[14px] font-[700] m-[0px]">Delivery Days</p>
    </div>
    <div className="flex-1">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="3"
        className="w-full text-[12px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.deliveryDays=== 0 || form.deliveryDays>30 ? "" : form.deliveryDays}
        onChange={e => {
          // Only allow digits
          const val = e.target.value;
          if (/^[0-9]*$/.test(val)) {
            setForm((f: Form) => ({ ...f, deliveryDays: Number(val) }));
          }
        }}
      />
      <div className="text-right text-xs text-gray-400">
        Between 1 and 30 days
      </div>
    </div>
  </div>
  )
}