'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
    redirectTo?: string;
}

export default function RoleGuard({
    children,
    allowedRoles,
    redirectTo = '/dashboard'
}: RoleGuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    const userRole = user.role || '';

                    if (allowedRoles.includes(userRole)) {
                        setIsAuthorized(true);
                    } else {
                        // User doesn't have permission
                        setIsAuthorized(false);
                        router.replace(redirectTo);
                    }
                } catch {
                    setIsAuthorized(false);
                    router.replace(redirectTo);
                }
            } else {
                // No user data, redirect to login
                setIsAuthorized(false);
                router.replace('/login');
            }
        }
    }, [allowedRoles, redirectTo, router]);

    // Loading state
    if (isAuthorized === null) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#ffcc00]" />
            </div>
        );
    }

    // Not authorized - show nothing (redirect happening)
    if (!isAuthorized) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#ffcc00]" />
                <p className="text-gray-500 text-sm">Anda tidak memiliki akses ke halaman ini</p>
            </div>
        );
    }

    return <>{children}</>;
}
