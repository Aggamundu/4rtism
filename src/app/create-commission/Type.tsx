import { FormProps, Form } from "./FormTypes";

export default function Type(props: FormProps) {
  const { form, setForm } = props;

  return (
    <div className="flex flex-row mb-[20px] gap-8 items-start justify-start">
    <p className="font-[700] m-[0px] w-[230px] text-[14px]">Type</p>
    <div className="flex-1">
      <select
        className="w-full text-[12px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.type}
        onChange={e => setForm((f: Form) => ({ ...f, type: e.target.value }))}
        required
      >
        <option value="">Select a type</option>
        <option value="Graphic Design/Logo">Graphic Design/Logo</option>
        <option value="Chibi">Chibi</option>
        <option value="Cartoon Style">Cartoon Style</option>
        <option value="Anime Style">Anime Style</option>
        <option value="Semirealistic-Realistic">Semirealistic-Realistic</option>
        <option value="Hyperrealistic">Hyperrealistic</option>
      </select>
    </div>
  </div>
  )
}