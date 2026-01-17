import React from "react";
import Flatpickr from "react-flatpickr";
import { Indonesian } from "flatpickr/dist/l10n/id.js";
import "flatpickr/dist/themes/material_blue.css";

interface MyDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

const DatePicker: React.FC<MyDatePickerProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative w-full">
      <Flatpickr
        value={value}
        onChange={(_dates: Date[], dateStr: string) => {
          onChange(dateStr);
        }}
        // Tambahkan onReady untuk memaksa input menjadi text di mobile
        onReady={(_dates, _dateStr, instance) => {
          const input = instance.altInput || instance.input;
          input.setAttribute("type", "text");
        }}
        options={{
          locale: Indonesian,
          altInput: true,
          altFormat: "d F Y",
          dateFormat: "Y-m-d",
          allowInput: true,
          disableMobile: true, // WAJIB
          monthSelectorType: "static",
          static: false,
          appendTo: window.document.body,
          clickOpens: true,
        }}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-4 pr-10 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
      />

      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
        <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </div>
    </div>
  );
};

export default DatePicker;