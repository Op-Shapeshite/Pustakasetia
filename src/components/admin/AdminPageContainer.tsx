'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { Search, Plus, ChevronDown, Check } from 'lucide-react';

interface AdminPageContainerProps {
    // Search
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;

    // Pagination Limit
    limit: number;
    onLimitChange: (limit: number) => void;

    // Add Button
    onAddClick: () => void;
    addButtonText?: string;

    // Table Content
    children: ReactNode;

    // Error handling
    error?: string | null;
    onRetry?: () => void;
}

const limitOptions = [
    { value: 10, label: '10 per halaman' },
    { value: 20, label: '20 per halaman' },
    { value: 50, label: '50 per halaman' },
    { value: 100, label: '100 per halaman' },
];

export default function AdminPageContainer({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Cari",
    limit,
    onLimitChange,
    onAddClick,
    addButtonText = "Tambah Baru",
    children,
    error,
    onRetry
}: AdminPageContainerProps) {
    const [isLimitOpen, setIsLimitOpen] = useState(false);
    const limitRef = useRef<HTMLDivElement>(null);

    const selectedOption = limitOptions.find(opt => opt.value === limit);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (limitRef.current && !limitRef.current.contains(e.target as Node)) {
                setIsLimitOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="mx-3 md:mx-6 bg-white rounded-2xl shadow-sm -mt-[65px]">
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                    {onRetry && (
                        <button onClick={onRetry} className="ml-2 underline">
                            Coba lagi
                        </button>
                    )}
                </div>
            )}

            {/* Header Actions - Stack on mobile, row on desktop */}
            <div className="flex flex-col md:flex-row pt-5 md:pt-7 px-4 md:px-8 gap-4 md:items-center md:justify-between mb-6">
                {/* Top row on mobile: Limit + Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 w-full md:w-auto">
                    {/* Limit Selector - SearchableSelect Style */}
                    <div ref={limitRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsLimitOpen(!isLimitOpen)}
                            className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00] flex items-center justify-between w-full sm:min-w-[160px] hover:border-[#ffcc00] transition-colors"
                        >
                            <span>{selectedOption?.label || '10 per halaman'}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${isLimitOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown */}
                        {isLimitOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                <div className="max-h-[200px] overflow-y-auto">
                                    {limitOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => {
                                                onLimitChange(opt.value);
                                                setIsLimitOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center justify-between transition-colors ${opt.value === limit ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-gray-700'
                                                }`}
                                        >
                                            <span>{opt.label}</span>
                                            {opt.value === limit && (
                                                <Check className="w-4 h-4" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full sm:w-[200px] md:w-[280px] pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00] focus:border-[#ffcc00] bg-white"
                        />
                    </div>
                </div>

                {/* Add Button - Full width on mobile */}
                <button
                    onClick={onAddClick}
                    className="flex items-center justify-center gap-2 bg-[#ffcc00] z-40 text-gray-900 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#ffdb4d] transition-colors shadow-sm w-full md:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    {addButtonText}
                </button>
            </div>

            {/* Content */}
            {children}
        </div>
    );
}
