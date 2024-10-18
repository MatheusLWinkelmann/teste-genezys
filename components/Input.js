export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-[#888888] text-sm mb-2 font-satoshi" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-transparent text-[#888888] placeholder-[#888888] border border-[#888888] rounded-md p-2 focus:outline-none focus:bg-[rgba(255,255,255,0.13)] font-satoshi ${className}`}
      />
    </div>
  );
}
