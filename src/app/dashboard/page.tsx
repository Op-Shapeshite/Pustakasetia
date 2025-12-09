'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Book, Users, RefreshCw, ShoppingBag, Activity, ArrowDown, TrendingUp, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bookService, userService, categoryService } from '@/utils/adminData';
import { motion } from 'framer-motion';

interface Category {
    id: number;
    name: string;
    _count?: {
        books: number;
    };
}

export default function DashboardHomePage() {
    const [stats, setStats] = useState({
        visitors: 0,
        books: 0,
        categories: 0,
        sales: 120, // Mock for now
        activity: 941, // Mock
        checkout: 43 // Mock
    });

    // Category Widget State
    const [categories, setCategories] = useState<Category[]>([]);
    const [catPage, setCatPage] = useState(1);
    const [catTotal, setCatTotal] = useState(0);
    const [loadingCat, setLoadingCat] = useState(false);

    const CAT_LIMIT = 5;

    // Fetch Global Stats
    useEffect(() => {
        async function fetchGlobalStats() {
            try {
                const [booksRes, usersRes, catsRes] = await Promise.all([
                    bookService.getAll({ limit: 1 }),
                    userService.getAll({ limit: 1 }),
                    categoryService.getAll({ limit: 1 })
                ]);

                setStats(prev => ({
                    ...prev,
                    books: booksRes.pagination?.total ?? 0,
                    visitors: usersRes.pagination?.total ?? 0,
                    categories: catsRes.pagination?.total ?? 0,
                }));
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        }
        fetchGlobalStats();
    }, []);

    // Fetch Categories for Widget with Pagination
    useEffect(() => {
        async function fetchCategories() {
            setLoadingCat(true);
            try {
                // Ensure api supports include for counts if available, otherwise just list
                const res = await categoryService.getAll({ page: catPage, limit: CAT_LIMIT });
                setCategories(res.data as any);
                setCatTotal(res.pagination?.total ?? 0);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            } finally {
                setLoadingCat(false);
            }
        }
        fetchCategories();
    }, [catPage]);

    const handleNextCat = () => {
        if (catPage * CAT_LIMIT < catTotal) {
            setCatPage(p => p + 1);
        }
    };

    const handlePrevCat = () => {
        if (catPage > 1) {
            setCatPage(p => p - 1);
        }
    };

    const trafficData = [
        { source: 'Google', users: 465, sessions: 754, bounce: '23,5%', duration: '00:06:25', trend: 'up' },
        { source: 'Instagram', users: 787, sessions: 987, bounce: '16,2%', duration: '00:06:25', trend: 'up' },
        { source: 'Direct', users: 463, sessions: 541, bounce: '-9,4%', duration: '00:06:25', trend: 'down' },
        { source: 'Tiktok', users: 862, sessions: 954, bounce: '-10,6%', duration: '00:06:25', trend: 'down' },
        { source: 'Link', users: 458, sessions: 504, bounce: '31,5%', duration: '00:06:25', trend: 'up' },
    ];

    return (
        <AdminLayout title="Ringkasan Analisis">
            {/* Main Content Area */}
            <div className="relative pb-12 px-6">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 -mt-16"
                >

                    {/* Left Column (2/3) - 4 Cards Grid */}
                    <div className="lg:col-span-2 relative grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Visitor Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 h-[200px] flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-700 text-lg">Total Pengunjung</span>
                                <div className="p-2 rounded-full bg-[#ffcc00] text-white">
                                    <Users className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-[#2f2f2f] mb-2">{stats.visitors.toLocaleString('id-ID')}</h3>
                                <p className="text-sm">
                                    <span className="text-red-500">-2,65%</span>{' '}
                                    <span className="text-gray-500">Pengunjung lebih sedikit dari biasanya</span>
                                </p>
                            </div>
                        </motion.div>

                        {/* Book Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 h-[200px] flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-700 text-lg">Total Buku</span>
                                <div className="p-2 rounded-full bg-[#ffcc00] text-white">
                                    <Book className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-[#2f2f2f] mb-2">{stats.books.toLocaleString('id-ID')}</h3>
                                <p className="text-sm text-gray-500">
                                    Total Buku yang telah di upload
                                </p>
                            </div>
                        </motion.div>

                        {/* Activity Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className="bg-white  rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 h-[200px] flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-700 text-lg">Aktifitas Bulan Ini</span>
                                <div className="p-2 rounded-full bg-[#ffcc00] text-white">
                                    <Activity className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-[#2f2f2f] mb-2">{stats.activity}</h3>
                                <p className="text-sm">
                                    <span className="text-green-500">4,25%</span>{' '}
                                    <span className="text-gray-500">Lebih banyak Aktifitas dari biasanya</span>
                                </p>
                            </div>
                        </motion.div>

                        {/* Check Out Card */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="bg-white  rounded-xl p-6 h-[200px] flex flex-col justify-between shadow-none border-none"
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-gray-700 text-lg">Check Out</span>
                                <div className="p-2 rounded-full bg-[#ffcc00] text-white">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-[#2f2f2f] mb-2">{stats.checkout}</h3>
                                <p className="text-sm">
                                    <span className="text-red-500">-4,25%</span>{' '}
                                    <span className="text-gray-500">Aktivitas lebih sedikit dari biasanya</span>
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column (1/3) - Category List (Dynamic) */}
                    <div className="flex  flex-col gap-6 lg:col-span-1">
                        {/* Date Filter */}


                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-gray-700 text-lg">Kategori Buku</h3>
                                <RefreshCw className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => setCatPage(1)} />
                            </div>
                            <div className="space-y-1 flex-1">
                                {categories.map((cat, i) => (
                                    <div key={i} className="flex items-center justify-between py-1">
                                        <span className="text-gray-700 font-medium truncate flex-1">{cat.name}</span>
                                        <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm font-medium text-gray-600 min-w-[40px] text-center">
                                            {(cat as any)._count?.books ?? Math.floor(Math.random() * 20) + 1}
                                        </span>
                                    </div>
                                ))}
                                {loadingCat && (
                                    <div className="py-4 text-center text-sm text-gray-400">Loading...</div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            <div className="mt-6 flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-50">
                                <span>{(catPage - 1) * CAT_LIMIT + 1} - {Math.min(catPage * CAT_LIMIT, catTotal)} dari {catTotal}</span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={handlePrevCat}
                                        disabled={catPage === 1}
                                        className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50 text-xs disabled:opacity-50"
                                    >
                                        &lt;
                                    </button>
                                    <button className="w-6 h-6 flex items-center justify-center bg-[#ffcc00] text-white rounded text-xs">
                                        {catPage}
                                    </button>
                                    <button
                                        onClick={handleNextCat}
                                        disabled={catPage * CAT_LIMIT >= catTotal}
                                        className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50 text-xs disabled:opacity-50"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Section - Traffic & Donut */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    {/* Traffic Table */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-gray-700 text-lg">Traffic</h3>
                            <RefreshCw className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
                                        <th className="pb-3 font-medium">Source</th>
                                        <th className="pb-3 font-medium text-right">Pengguna</th>
                                        <th className="pb-3 font-medium text-right">Sesi</th>
                                        <th className="pb-3 font-medium text-right">Rasio Pentalan</th>
                                        <th className="pb-3 font-medium text-right">Avg. Durasi Sesi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trafficData.map((row, i) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="py-4 text-gray-700">{row.source}</td>
                                            <td className="py-4 text-right text-gray-500">{row.users}</td>
                                            <td className="py-4 text-right text-gray-500">{row.sessions}</td>
                                            <td className={`py-4 text-right font-medium ${row.bounce.includes('-') ? 'text-red-500' : 'text-green-500'}`}>{row.bounce}</td>
                                            <td className="py-4 text-right text-gray-500">{row.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Traffic Pagination Placeholder */}
                        <div className="mt-4 flex justify-end">
                            <div className="flex gap-1">
                                <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50">&lt;</button>
                                <button className="w-8 h-8 flex items-center justify-center bg-[#ffcc00] text-white rounded">1</button>
                                <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50">&gt;</button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Sessions Donut */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                        <h3 className="font-semibold text-gray-700 text-lg mb-2">Mobile Sessions</h3>
                        <p className="text-gray-400 text-sm mb-8">Persentase pengguna yang menggunakan perangkat seluler dibandingkan dengan perangkat lain.</p>

                        <div className="flex-1 flex items-center justify-center relative">
                            {/* CSS Conic Gradient Donut */}
                            <div className="w-48 h-48 rounded-full relative" style={{ background: 'conic-gradient(#ffcc00 0% 80%, #e5e7eb 80% 100%)' }}>
                                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                                    <span className="text-4xl font-bold text-[#2f2f2f]">80%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-8 mt-8">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Mobile</span>
                                    <span className="text-sm font-bold text-[#2f2f2f]">1700</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#ffcc00] rounded-sm"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Desktop</span>
                                    <span className="text-sm font-bold text-[#2f2f2f]">200</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    © 2025 PUSTAKA SETIA All right reserved
                </div>
            </div>
        </AdminLayout>
    );
}
