interface InputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  label?: string;
}

export const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  label,
}: InputProps) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-gray-700 mb-2">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border rounded ${className}`}
      />
    </div>
  );
};