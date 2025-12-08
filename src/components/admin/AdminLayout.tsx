'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
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
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Delay check slightly to ensure localStorage is ready after navigation
        const checkAuth = () => {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                router.replace('/login');
            } else {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };

        // Small delay to ensure storage is ready
        const timer = setTimeout(checkAuth, 100);
        return () => clearTimeout(timer);
    }, [router]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6f8fd]">
                <Loader2 className="w-8 h-8 animate-spin text-[#ffcc00]" />
            </div>
        );
    }

    // If not authenticated, show nothing (redirect is happening)
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6f8fd]">
                <Loader2 className="w-8 h-8 animate-spin text-[#ffcc00]" />
            </div>
        );
    }

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
