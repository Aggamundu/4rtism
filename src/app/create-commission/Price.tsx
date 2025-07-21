import { FormProps, Form } from "./FormTypes";

export default function Price(props: FormProps) {
  const { form, setForm } = props;

  return (
    <div className="flex flex-row mb-[20px] gap-8 items-start justify-start">
    <div className="flex flex-col">
      <p className="text-[14px] font-[700] m-[0px] w-[230px]">Pricing</p>
    </div>
    <div className="flex-1">
      <input
        type="number"
        placeholder="Price (in USD)"
        className="w-full text-[12px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.price}
        onChange={e => setForm((f: Form) => ({ ...f, price: Number(e.target.value) }))}
        required
      />
    </div>
  </div>
  )
}