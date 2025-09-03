import { useState } from "react";

interface CategoryProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Category({ value, onChange }: CategoryProps) {
  const categories = [
    "Chibi",
    "Graphic Design", 
    "Cartoon",
    "Anime",
    "Semi-Realistic",
    "Hyper-Realistic",
    "Other"
  ];

  return (
    <div className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">
      <label className="text-sm font-bold ">
        Category:
      </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none text-sm"
    >
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
    </div>
  );
}
