import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  searchable?: boolean; // 🔍
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  value,
  disabled = false,
  searchable = false,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof value !== "undefined") {
      setSelectedValue(value);
    }
  }, [value]);

  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label || "";

  const filteredOptions = searchable
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* DISPLAY */}
      <div
        className={`h-11 w-full cursor-pointer rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs
          ${selectedValue ? "text-gray-800" : "text-gray-400"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-transparent"}
        `}
        onClick={() => !disabled && setOpen(!open)}
      >
        {selectedLabel || placeholder}
      </div>

      {/* DROPDOWN */}
      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-white shadow-lg max-h-60 overflow-y-auto">
          {searchable && (
            <input
              type="text"
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-b px-3 py-2 text-sm outline-none"
            />
          )}

          {filteredOptions.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-400">
              Data tidak ditemukan
            </div>
          )}

          {filteredOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                setSelectedValue(opt.value);
                onChange(opt.value);
                setOpen(false);
                setSearch("");
              }}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
