'use client';

import { useState, useRef, useEffect } from 'react';
import { User, X, Plus } from 'lucide-react';

interface AuthorAutocompleteProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    label?: string;
    className?: string;
}

export default function AuthorAutocomplete({
    value = [],
    onChange,
    placeholder = "Cari atau tambah penulis...",
    label,
    className = ""
}: AuthorAutocompleteProps) {
    const [inputValue, setInputValue] = useState('');
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
            const response = await fetch('/api/authors');
            if (!response.ok) throw new Error('Failed to fetch authors');
            const data = await response.json();
            setAllAuthors(data.data || []);
        } catch (error) {
            console.error('Failed to load authors:', error);
        }
    };

    // Filter suggestions based on input
    useEffect(() => {
        const query = inputValue.toLowerCase();
        const unselected = allAuthors.filter(a => !value.includes(a));

        if (query.length > 0) {
            const filtered = unselected.filter(author =>
                author.toLowerCase().includes(query)
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions(unselected.slice(0, 5));
        }
    }, [inputValue, allAuthors, value]);

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
        if (!value.includes(author)) {
            onChange([...value, author]);
        }
        setInputValue('');
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleRemove = (authorToRemove: string) => {
        onChange(value.filter(author => author !== authorToRemove));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (!isOpen) setIsOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            // Add new author if it doesn't exist in suggestions (or explicitly by user intent)
            if (!value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()]);
                setInputValue('');
                setIsOpen(false);
            }
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            // Remove last tag on backspace if input is empty
            handleRemove(value[value.length - 1]);
        }
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {label && (
                <label className="block text-sm text-gray-500 mb-2">{label}</label>
            )}

            <div
                className="w-full min-h-[46px] px-3 py-2 border border-[#d9d9d9] rounded-lg text-sm bg-white focus-within:ring-2 focus-within:ring-[#ffcc00] focus-within:border-transparent flex flex-wrap gap-2 items-center cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                {/* Selected Tags */}
                {value.map((author, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-1 bg-yellow-50 text-gray-800 px-2 py-1 rounded-md border border-yellow-200"
                    >
                        <User className="w-3 h-3 text-yellow-600" />
                        <span className="text-xs font-medium">{author}</span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(author);
                            }}
                            className="p-0.5 hover:bg-yellow-100 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {/* Input Field */}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder={value.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                />
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && (suggestions.length > 0 || (inputValue && !value.includes(inputValue))) && (
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

                        {/* Option to create new author if typing and not in exact match */}
                        {inputValue && !suggestions.includes(inputValue) && !value.includes(inputValue) && (
                            <button
                                type="button"
                                onClick={() => handleSelect(inputValue)}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-[#ffcc00] font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Tambah "{inputValue}"</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
