'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Check, ChevronDown, Loader2 } from 'lucide-react';

interface Option {
    id: number;
    name: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    onCreateNew?: (name: string) => Promise<Option | null>;
    placeholder?: string;
    label?: string;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    onCreateNew,
    placeholder = 'Pilih...',
    label,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Filter options based on search
    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(search.toLowerCase())
    );

    // Check if search term exists in options
    const searchExists = options.some(
        opt => opt.name.toLowerCase() === search.toLowerCase()
    );

    // Get selected option name
    const selectedOption = options.find(opt => opt.id.toString() === value);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (optionId: string) => {
        onChange(optionId);
        setIsOpen(false);
        setSearch('');
    };

    const handleCreateNew = async () => {
        if (!onCreateNew || !search.trim() || searchExists) return;

        setIsCreating(true);
        try {
            const newOption = await onCreateNew(search.trim());
            if (newOption) {
                onChange(newOption.id.toString());
                setIsOpen(false);
                setSearch('');
            }
        } catch (err) {
            console.error('Failed to create option:', err);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            {label && (
                <label className="block text-sm text-gray-500 mb-2">{label}</label>
            )}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00] flex items-center justify-between"
            >
                <span className={selectedOption ? 'text-black' : 'text-gray-400'}>
                    {selectedOption?.name || placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[#d9d9d9] rounded-lg shadow-lg overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kategori..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#ffcc00]"
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-[200px] overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleSelect(opt.id.toString())}
                                    className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center justify-between"
                                >
                                    <span>{opt.name}</span>
                                    {opt.id.toString() === value && (
                                        <Check className="w-4 h-4 text-[#ffcc00]" />
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                Tidak ada kategori ditemukan
                            </div>
                        )}

                        {/* Create New Option */}
                        {onCreateNew && search.trim() && !searchExists && (
                            <button
                                type="button"
                                onClick={handleCreateNew}
                                disabled={isCreating}
                                className="w-full px-4 py-2.5 text-sm text-left bg-[#ffcc00]/10 hover:bg-[#ffcc00]/20 flex items-center gap-2 border-t border-gray-100 text-[#2f2f2f] font-medium"
                            >
                                {isCreating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                                <span>Buat kategori "{search}"</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
