'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import { bookService } from '@/utils/adminData';

interface AuthorAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    className?: string;
}

export default function AuthorAutocomplete({
    value,
    onChange,
    placeholder = "Nama penulis",
    label,
    className = ""
}: AuthorAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [allAuthors, setAllAuthors] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load all authors on mount
    useEffect(() => {
        loadAuthors();
    }, []);

    const loadAuthors = async () => {
        try {
            const response = await bookService.getAll({ page: 1, limit: 1000 });
            const authors = [...new Set(response.data.map(book => book.author))].sort();
            setAllAuthors(authors);
        } catch (error) {
            console.error('Failed to load authors:', error);
        }
    };

    // Filter suggestions based on input
    useEffect(() => {
        if (value.length > 0) {
            const filtered = allAuthors.filter(author =>
                author.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
            setIsOpen(filtered.length > 0 && value.length > 0);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [value, allAuthors]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (author: string) => {
        onChange(author);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleFocus = () => {
        if (value.length > 0 && suggestions.length > 0) {
            setIsOpen(true);
        }
    };



    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {label && (
                <label className="block text-sm text-gray-500 mb-2">{label}</label>
            )}

            {/* Input Field */}
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 border border-[#d9d9d9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00] bg-white"
                />
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    <div className="max-h-48 overflow-y-auto">
                        {suggestions.map((author, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSelect(author)}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">{author}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
