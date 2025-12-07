'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Book, Users, Shield, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { bookService, userService, roleService } from '@/utils/adminData';

export default function DashboardHomePage() {
    const [stats, setStats] = useState({
        books: 0,
        users: 0,
        roles: 0,
    });

    useEffect(() => {
        setStats({
            books: bookService.getAll().length,
            users: userService.getAll().length,
            roles: roleService.getAll().length,
        });
    }, []);

    const statCards = [
        { label: 'Total Buku', value: stats.books, icon: Book, color: 'bg-blue-500' },
        { label: 'Total Pengguna', value: stats.users, icon: Users, color: 'bg-green-500' },
        { label: 'Total Role', value: stats.roles, icon: Shield, color: 'bg-purple-500' },
        { label: 'Penjualan', value: '120', icon: TrendingUp, color: 'bg-orange-500' },
    ];

    return (
        <AdminLayout title="DASBOR">
            <div className="p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-bold text-[#2f2f2f]">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <h3 className="text-lg font-semibold text-[#2f2f2f] mb-4">Aksi Cepat</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="/dashboard/books" className="flex items-center gap-4 p-4 bg-[#ffcc00]/10 hover:bg-[#ffcc00]/20 rounded-xl transition-colors">
                        <div className="bg-[#ffcc00] p-3 rounded-lg">
                            <Book className="w-5 h-5 text-[#2f2f2f]" />
                        </div>
                        <div>
                            <p className="font-medium text-[#2f2f2f]">Kelola Buku</p>
                            <p className="text-sm text-gray-500">Tambah, edit, atau hapus buku</p>
                        </div>
                    </a>
                    <a href="/dashboard/users" className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-medium text-[#2f2f2f]">Kelola Pengguna</p>
                            <p className="text-sm text-gray-500">Kelola data pengguna sistem</p>
                        </div>
                    </a>
                    <a href="/dashboard/roles" className="flex items-center gap-4 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
                        <div className="bg-purple-500 p-3 rounded-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-medium text-[#2f2f2f]">Kelola Role</p>
                            <p className="text-sm text-gray-500">Atur hak akses pengguna</p>
                        </div>
                    </a>
                </div>
            </div>
        </AdminLayout>
    );
}
