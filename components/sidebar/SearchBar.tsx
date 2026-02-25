"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-9 w-full bg-white"
      />
    </div>
  );
}