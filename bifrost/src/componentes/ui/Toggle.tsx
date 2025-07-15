"use client";

import { ChangeEvent } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <label className="relative inline-block w-12 h-6">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
        className="opacity-0 w-0 h-0 peer"
      />
      <span
        className="
          absolute cursor-pointer top-0 left-0 right-0 bottom-0
          bg-gray-300 rounded-full transition duration-300 peer-checked:bg-green-500
          before:content-[''] before:absolute before:left-1 before:top-1 before:bg-white
          before:h-4 before:w-4 before:rounded-full before:transition before:duration-300
          peer-checked:before:translate-x-6
        "
      ></span>
    </label>
  );
}