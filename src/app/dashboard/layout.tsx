'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            // Redirect to login if not authenticated
            router.replace('/login?redirect=/dashboard');
            return;
        }

        try {
            // Verify token is not expired (basic check)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000; // Convert to milliseconds

            if (Date.now() >= expiry) {
                // Token expired, clear and redirect
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                router.replace('/login?redirect=/dashboard&expired=true');
                return;
            }

            setIsAuthenticated(true);
        } catch {
            // Invalid token format, clear and redirect
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            router.replace('/login?redirect=/dashboard');
            return;
        }

        setIsLoading(false);
    };

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-[#ffcc00] animate-spin" />
                    <p className="text-gray-600 font-['Poppins',sans-serif]">Memverifikasi akses...</p>
                </div>
            </div>
        );
    }

    // Show nothing while redirecting (prevents flash of content)
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
