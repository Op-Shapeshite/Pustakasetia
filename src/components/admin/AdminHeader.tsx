'use client';

import { Menu, Calendar } from 'lucide-react';

interface AdminHeaderProps {
    title: string;
    onMenuClick?: () => void;
}

export default function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
    const today = new Date();
    const dateStr = today.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="relative">
            {/* Blue Gradient Header */}
            <div className="h-[180px] bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] relative overflow-hidden">
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />

                {/* Content */}
                <div className="relative z-10 h-full px-6 py-4">
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu */}
                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-2 bg-white/20 backdrop-blur-sm rounded-lg"
                        >
                            <Menu className="w-6 h-6 text-white" />
                        </button>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                            {title}
                        </h1>

                        {/* Date Picker */}
                        <div className="hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                            <Calendar className="w-4 h-4 text-[#2f2f2f]" />
                            <span className="text-sm font-medium text-[#2f2f2f]">{dateStr}</span>
                        </div>
                    </div>

                    {/* Admin Profile */}
                    <div className="absolute bottom-4 left-6 flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-white text-sm">Admin</p>
                            <p className="text-white/70 text-xs">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
