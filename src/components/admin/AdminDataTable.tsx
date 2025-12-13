'use client';

import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
    header: string;
    accessor?: keyof T | string;
    className?: string;
    headerClassName?: string;
    render?: (item: T, index: number) => ReactNode;
}

interface AdminDataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    searchQuery?: string;

    // Pagination
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export default function AdminDataTable<T extends { id: string | number }>({
    columns,
    data,
    loading = false,
    emptyMessage = 'Belum ada data',
    searchQuery = '',
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange
}: AdminDataTableProps<T>) {
    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getCellValue = (item: T, column: Column<T>, index: number): ReactNode => {
        if (column.render) {
            return column.render(item, index);
        }

        if (column.accessor) {
            // Handle nested accessors like 'category.name'
            const value = column.accessor.toString().split('.').reduce((obj: any, key) => obj?.[key], item);
            return value ?? '-';
        }

        return '-';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {columns.map((column, idx) => (
                                <th
                                    key={idx}
                                    className={column.headerClassName || "text-left px-6 py-4 font-medium text-gray-600 text-sm whitespace-nowrap"}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                {columns.map((column, colIdx) => (
                                    <td
                                        key={colIdx}
                                        className={column.className || "px-6 py-6 text-sm text-gray-700 whitespace-nowrap"}
                                    >
                                        {getCellValue(item, column, index)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {!loading && data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                                    {searchQuery ? `Tidak ada data yang ditemukan` : emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Stack on mobile */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-100 gap-3">
                <p className="text-sm text-gray-500 text-center sm:text-left">
                    Menampilkan {startItem}-{endItem} dari {totalItems} data
                </p>
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-[#2f2f2f] font-medium">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
