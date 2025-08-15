export default function TextDisplay(props: { title: string, value: string }) {
  const { title, value } = props;
  return (
    <div className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">
      <label className="text-black text-sm mb-2 font-bold">{title} <span className="text-red-500"> *</span></label>
      <p className="text-black text-sm">{value}</p>
    </div>
  )
}