import { FormProps, Form } from "./FormTypes";

export default function Title(props: FormProps) {
  const { form, setForm } = props;

  return (
    <div className="flex flex-row mb-[0px] gap-8 items-start justify-start">
    <div className=" flex flex-col w-[230px]">
      <p className="text-[14px] font-[700] m-[0px]">Commission Title</p>
      <p className="m-[0px] text-[10px] text-gray-600">Include keywords that clients would likely to use to search for art like yours!</p>
    </div>
    <div className="flex-1">
      <textarea
        placeholder="Title"
        className="w-full text-[12px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={2}
        value={form.title}
        onChange={e => setForm((f:Form)=> ({ ...f, title: e.target.value }))}
        maxLength={100}
      />
      <div className="text-right text-xs text-gray-400">
        {form.title.length}/100
      </div>
    </div>
  </div>
  )
}