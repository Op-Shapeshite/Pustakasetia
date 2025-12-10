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
    isScrolled?: boolean;
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

export default function AdminSidebar({ isOpen = true, onClose, isScrolled = false }: AdminSidebarProps) {
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
            // Use window.location for full page redirect to ensure clean state
            window.location.href = '/';
        }
    };

    return (
        <>
            {/* Mobile Overlay - only render when open on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-screen z-50
        transition-transform duration-300 w-[270px]
        flex flex-col gap-4
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
            >
                {/* Mobile Close Button - repositioned slightly */}
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-50"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Logo & Profile Section - Shows in both states */}
                <div className={`px-6 flex flex-col transition-all duration-300 ${isScrolled ? 'pt-4 pb-2' : 'pt-[30px] items-center text-center'}`}>
                    {isScrolled ? (
                        // Scrolled/Compact State: Row Layout
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden shadow-sm border-2 border-white flex-shrink-0">
                                <img
                                    src="/img/logo.png"
                                    alt="Admin Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm uppercase">Pustaka Setia</h3>
                            </div>
                        </div>
                    ) : (
                        // Default State: Large Centered Layout
                        <>
                            <div className="w-20 h-20 bg-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm border-2 border-white">
                                <img
                                    src="/img/logo.png"
                                    alt="Admin Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="mb-2">
                                <h3 className="font-bold text-white text-xl mb-1">Admin</h3>
                                <p className="text-sm text-white/80">Admin Pustaka Setia</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Navigation - White Background Container with Rounded Corners */}
                <div className={`flex-1 bg-white px-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${isScrolled ? 'py-4' : 'py-8 rounded-tr-[30px]'}`}>
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
                    <div className="mt-8 pt-4 border-t border-gray-100 relative z-50">
                        <button
                            type="button"
                            onClick={() => {
                                console.log('Logout clicked!');
                                logout();
                                localStorage.clear();
                                window.location.href = '/';
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors w-full cursor-pointer"
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

