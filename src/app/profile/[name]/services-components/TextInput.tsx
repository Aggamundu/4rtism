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
      <label className="text-custom-lightgray text-sm mb-2 font-bold">{title}<span className="text-red-500"> *</span></label>
      <input
        className="w-full h-10 bg-custom-gray text-white rounded-lg p-3 focus:outline-none "
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