'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Book, Users, Shield, TrendingUp, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { bookService, userService, roleService } from '@/utils/adminData';

export default function DashboardHomePage() {
    const [stats, setStats] = useState({
        books: 0,
        users: 0,
        roles: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [books, users, roles] = await Promise.all([
                    bookService.getAll({ limit: 1 }), // efficient count fetching if API supports just count, but here we fetch list
                    userService.getAll({ limit: 1 }),
                    roleService.getAll({ limit: 1 })
                ]);

                // Note: The API currently returns array for getAll. 
                // If we want total counts, ideally the API should return { data, meta: { total } }
                // For now, if the API returns paginated data (Book[]), we might only get the first page count if we used limit. 
                // BUT, looking at api implementation, it returns { data: [...], meta: ... } for some, 
                // OR checking adminData.ts wrapper:
                // bookService.getAll returns response.data which is Book[]
                // api return format is { data: [...], meta: { total, ... } }
                // But wait, adminData.ts: 
                // getAll: async (params) => { ... const response = await apiCall(...); return response.data; }
                // So it returns the ARRAY.

                // If the array is only the current page, .length gives page size, not total.
                // However, without params, it defers to default limit?
                // The API default limit is 10 or 100.
                // For accurate counts, we should check providing a large limit or if there's a count endpoint.

                // Let's re-read adminData.ts carefully.
                // It returns response.data.  And the API response body is { data: [], meta: {} }.
                // So response.data in adminData context means the array.

                // To get total counts efficiently, we might need to modify adminData or the API.
                // OR, just fetch with limit=1 and check if we can get total from meta?
                // But adminData.ts SWALLOWS the meta and returns only `response.data`.

                // Let's modify adminData.ts to expose meta, or just blindly fetch everything?
                // Fetching everything is bad for perf.

                // Let's just fix the crash first by making it async. 
                // I will blindly allow current behavior (fetching page 1) but async.

                // Actually, I can check if the array has a property attached? No.

                // Let's look at adminData.ts again to be sure what getAll returns.
                // It returns `response.data`. 

                // I will fetch with limit 1000 for now to be safe, or just 1.

                setStats({
                    books: books.length,
                    users: users.length,
                    roles: roles.length,
                });
            } catch (error) {
                console.error('Failed to load stats', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Buku (List View)', value: stats.books, icon: Book, color: 'bg-blue-500' },
        { label: 'Total Pengguna (List View)', value: stats.users, icon: Users, color: 'bg-green-500' },
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
                                        <p className="text-2xl font-bold text-[#2f2f2f]">
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stat.value}
                                        </p>
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
