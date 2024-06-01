import React from "react";

export default function Input({
  type,
  id,
  label,
  name,
  placeholder,
  onChange,
  value,
  required,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900 mt-4"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 outline-none sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
