'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
    children,
    title = 'Dashboard'
}: {
    children: React.ReactNode;
    title?: string;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#f6f8fd]">
            {/* Sidebar */}
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen md:ml-0">
                {/* Header */}
                <AdminHeader
                    title={title}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                {/* Content */}
                <div className="-mt-16 relative z-10">
                    <div className="mx-4 md:mx-6">
                        <div className="bg-white rounded-2xl shadow-lg min-h-[calc(100vh-200px)]">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
