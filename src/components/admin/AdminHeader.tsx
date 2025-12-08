'use client';

import { useState, useEffect } from 'react';
import { Menu, Calendar } from 'lucide-react';

interface AdminHeaderProps {
    title: string;
    onMenuClick?: () => void;
}

export default function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
    const [dateStr, setDateStr] = useState('');

    useEffect(() => {
        const today = new Date();
        setDateStr(today.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }));
    }, []);

    return (
        <div className="relative mb-6">
            {/* Clean White/Transparent Header */}
            <div className="bg-transparent relative">

                {/* Content */}
                <div className="relative z-30 px-[45px] py-4">
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu */}
                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-600"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Title (Mobile Only - Desktop Title is in Dashboard Page) */}
                        <h1 className="md:hidden text-xl font-bold text-[#2f2f2f]">
                            {title}
                        </h1>

                        {/* Date Picker - Right Aligned */}
                        <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm ml-auto">
                            <Calendar className="w-4 h-4 text-[#ffcc00]" />
                            <span className="text-sm font-medium text-[#2f2f2f]">{dateStr}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
