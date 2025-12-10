'use client';

import { useState } from 'react';
import { Menu, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePathname } from 'next/navigation';

import { DateRange } from 'react-day-picker';

interface AdminHeaderProps {
    title: string;
    onMenuClick?: () => void;
    isScrolled?: boolean;
    dateRange?: DateRange;
    setDateRange?: (range: DateRange | undefined) => void;
}

export default function AdminHeader({
    title,
    onMenuClick,
    isScrolled = false,
    dateRange,
    setDateRange
}: AdminHeaderProps) {
    const pathname = usePathname();
    const isDashboardPage = pathname === '/dashboard';

    return (
        <div className={`relative transition-all duration-500 ease-in-out flex w-full z-30 ${isScrolled ? 'h-[88px] items-center' : 'h-[260px] items-start'}`}>
            {/* Content Wrapper */}
            <div className={`w-full pr-[45px] ${isScrolled ? 'pl-6' : 'pl-6 pt-[126px]'}`}>
                <div className="flex items-center justify-between">
                    {/* Left Side: Mobile Menu & Title */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600 mb-1"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Title */}
                        <h1 className={`font-bold text-white drop-shadow-sm ${isScrolled ? 'text-2xl' : 'text-4xl transition-all duration-500'}`}>
                            {title}
                        </h1>
                    </div>

                    {/* Right Side: Modern Date Filter */}
                    <div className="flex items-end gap-4">
                        {/* Only show calendar filter on /dashboard page */}
                        {isDashboardPage && setDateRange && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl shadow-lg hover:bg-white/20 transition-all cursor-pointer group relative z-50">
                                        <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                                            <CalendarIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-white/70 uppercase tracking-wider font-medium leading-none mb-0.5">Filter Date</span>
                                            <span className="text-sm font-semibold text-white leading-none">
                                                {dateRange?.from ? (
                                                    dateRange.to ? (
                                                        <>
                                                            {dateRange.from.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {dateRange.to.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </>
                                                    ) : (
                                                        dateRange.from.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                                    )
                                                ) : 'Pick dates'}
                                            </span>
                                        </div>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white border-none shadow-xl z-[60]" align="end">
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        initialFocus
                                        className="bg-white rounded-md border"
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
