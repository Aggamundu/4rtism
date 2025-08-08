export default function TextArea(props: { title: string, value?: string }) {
  const { title, value = "" } = props;
  return (
    <div className="flex flex-col w-full bg-white rounded-card px-custom py-[1%] sm:max-w-[60%]">
    <label className="text-black text-sm mb-2 font-bold">{title}</label>
    <textarea 
      className="w-full h-32 bg-white text-black rounded-lg p-3 border border-gray-200 focus:outline-none focus:border-custom-accent"
    />
  </div>
  )
}