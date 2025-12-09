'use client';

import { ReactNode } from 'react';
import { Search, Plus } from 'lucide-react';

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

export default function AdminPageContainer({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Cari...",
    limit,
    onLimitChange,
    onAddClick,
    addButtonText = "Tambah Baru",
    children,
    error,
    onRetry
}: AdminPageContainerProps) {
    return (
        <div className="mx-6 bg-white rounded-2xl shadow-sm -mt-[65px]">
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

            {/* Header Actions */}
            <div className="flex pt-7 px-8 items-center z-50 justify-between mb-6">
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-[280px] text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00] bg-white"
                        />
                    </div>

                    {/* Limit Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Show:</span>
                        <select
                            value={limit}
                            onChange={(e) => onLimitChange(Number(e.target.value))}
                            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00] bg-white cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                {/* Add Button */}
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-2 bg-[#ffcc00] text-gray-900 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#ffdb4d] transition-colors z-50 shadow-sm"
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
