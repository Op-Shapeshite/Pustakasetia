'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

import { DateRange } from 'react-day-picker';

export default function AdminLayout({
    children,
    title = 'Dashboard',
    dateRange,
    setDateRange
}: {
    children: React.ReactNode;
    title?: string;
    dateRange?: DateRange;
    setDateRange?: (range: DateRange | undefined) => void;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const [isScrolled, setIsScrolled] = useState(false);

    // Only apply scroll effect on /dashboard page
    const isDashboardPage = pathname === '/dashboard';

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!isDashboardPage) return; // Skip scroll logic for other pages
        setIsScrolled(e.currentTarget.scrollTop > 20);
    };

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
        <div className="h-screen w-full bg-[#f6f8fd] relative overflow-hidden">
            {/* Global Background Image for Library Effect - LIMITED TO HEADER AREA ONLY */}
            <div className="fixed top-0 left-0 w-full h-[260px] pointer-events-none">
                <img
                    src="/img/library-background.png"
                    alt="Library Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            </div>

            {/* Solid White Background Below Header - BLOCKS library background */}
            <div className="fixed top-[260px] left-0 w-full h-full bg-[#f6f8fd] pointer-events-none" />

            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isScrolled={isScrolled}
            />

            {/* Main content area - Flex column for fixed header + scrolling content */}
            <div className="flex flex-col h-full md:ml-[270px] relative z-10">
                {/* Header - Fixed at top of this column */}
                <div className="flex-shrink-0 transition-all duration-300">
                    <AdminHeader
                        title={title}
                        onMenuClick={() => setIsSidebarOpen(true)}
                        isScrolled={isScrolled}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                    />
                </div>

                {/* Content - Scrollable Area */}
                <div
                    className={`flex-1 overflow-y-scroll scrollbar-hide relative ${isScrolled ? 'bg-[#f6f8fd] -mt-2' : '-mt-[60px] '}`}
                    onScroll={handleScroll}

                >
                    <div
                        className="relative pb-12 mt-[70px]   h-full "
                    >
                        {/* <div className="  "> */}
                        {children}
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
