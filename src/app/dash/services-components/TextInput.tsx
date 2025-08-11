export default function TextInput(props: {
  title: string;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  showCharCount?: boolean;
}) {
  const { title, value = "", onChange, maxLength, showCharCount = false } = props;
  return (
    <div className="">
      <label className="text-black text-sm mb-2 font-bold">{title}</label>
      <input
        className="w-full h-10 bg-white text-black rounded-lg p-3 border border-gray-200 focus:outline-none focus:border-custom-accent"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        maxLength={maxLength}
      />
      {showCharCount && maxLength && (
        <div className="text-xs text-gray-500 mt-1">
          {value.length}/{maxLength} characters
        </div>
      )}
    </div>
  )
}