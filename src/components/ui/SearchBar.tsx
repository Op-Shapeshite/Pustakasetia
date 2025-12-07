import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  variant?: 'default' | 'mobile';
}

export default function SearchBar({ 
  value, 
  onChange, 
  onSearch,
  placeholder = 'Cari buku...',
  variant = 'default' 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  // Mobile variant - compact design
  if (variant === 'mobile') {
    return (
      <div className={`
        relative w-full h-[40px]
        border rounded-lg transition-colors
        ${isFocused 
          ? 'border-yellow-400 bg-white' 
          : 'border-neutral-300 bg-white'
        }
      `}>
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-4 h-4 text-neutral-400" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full h-full pl-10 pr-10 text-sm text-neutral-900 placeholder-neutral-400 bg-transparent outline-none"
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 text-neutral-500" />
          </button>
        )}
      </div>
    );
  }

  // Default variant - desktop design
  return (
    <div className={`
      relative w-full h-[48px]
      border rounded-lg transition-colors
      ${isFocused 
        ? 'border-yellow-400 bg-white' 
        : 'border-neutral-300 bg-white'
      }
    `}>
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-5 h-5 text-neutral-400" />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-full pl-12 pr-12 text-base text-neutral-900 placeholder-neutral-400 bg-transparent outline-none"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>
      )}
    </div>
  );
}
