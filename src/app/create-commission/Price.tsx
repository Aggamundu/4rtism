import { Form, FormProps } from "./FormTypes";

export default function Price(props: FormProps) {
  const { form, setForm } = props;

  return (
    <div className="flex flex-row mb-[20px] gap-8 items-start justify-start">
      <div className="flex flex-col">
        <p className="text-[14px] font-[700] m-[0px] w-[230px]">Pricing (USD)</p>
      </div>
      <div className="flex-1">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Price (in USD)"
          className="w-full text-[12px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.price}
          onChange={e => {
            // Only allow digits
            const val = e.target.value;
            if (/^[0-9]*$/.test(val)) {
              setForm((f: Form) => ({ ...f, price: Number(val) }));
            }
          }}
        />
        {form.price < 30 && (
          <div className="text-right text-xs text-red-400">
            Must be greater than $30
          </div>
        )}
      </div>
    </div>
  )
}