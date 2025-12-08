'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, Book, Users, Shield, LogOut, X } from 'lucide-react';
import { useAppState } from '@/contexts/AppStateContext';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

interface NavItem {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    roles?: string[]; // If undefined, all roles can access
}

const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dasbor', icon: Home },
    { href: '/dashboard/books', label: 'Buku', icon: Book },
    { href: '/dashboard/users', label: 'Pengguna', icon: Users, roles: ['Admin'] },
    { href: '/dashboard/roles', label: 'Role', icon: Shield, roles: ['Admin'] },
];

export default function AdminSidebar({ isOpen = true, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAppState();
    const [userRole, setUserRole] = useState<string>('');

    // Load user role from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setUserRole(user.role || '');
                } catch {
                    console.error('Failed to parse user data');
                }
            }
        }
    }, []);

    // Filter nav items based on user role (case-insensitive)
    const filteredNavItems = navItems.filter(item => {
        // If no roles specified, everyone can access
        if (!item.roles) return true;
        // Check if user's role is in allowed roles (case-insensitive)
        return item.roles.some(role => role.toLowerCase() === userRole.toLowerCase());
    });

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            logout();
            router.push('/');
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-screen bg-white z-50
        transition-transform duration-300 w-[270px] shadow-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Logo & Profile Section */}
                <div className="pt-[50px] pb-6 px-6 border-b border-gray-100 flex flex-col items-center text-center">

                    {/* User Profile from Figma */}
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 overflow-hidden shadow-sm">
                        <img
                            src="/img/logo.png"
                            alt="Admin Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="mb-6">
                        <h3 className="font-bold text-[#2f2f2f] text-xl mb-1">Admin</h3>
                        <p className="text-sm text-gray-500">Admin Pustaka Setia</p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="p-4">
                    <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">Main</p>

                    <nav className="space-y-2">
                        {filteredNavItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${isActive
                                            ? 'bg-[#ffcc00] text-[#2f2f2f]'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }
                  `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="mt-8 pt-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

