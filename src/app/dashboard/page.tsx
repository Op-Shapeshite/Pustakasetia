'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Book, Users, RefreshCw, ShoppingBag, Activity, ArrowDown, TrendingUp, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bookService, userService, categoryService } from '@/utils/adminData';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface Category {
    id: number;
    name: string;
    _count?: {
        books: number;
    };
}

import { DateRange } from 'react-day-picker';

export default function DashboardHomePage() {
    const [stats, setStats] = useState({
        visitors: 0,
        visitorChange: 0,
        books: 0,
        categories: 0,
        activity: 0,
        activityChange: 0,
        checkout: 0,
        checkoutChange: 0
    });

    const [trafficData, setTrafficData] = useState<any[]>([]);
    const [loadingTraffic, setLoadingTraffic] = useState(true);
    const [deviceData, setDeviceData] = useState({
        mobile: 0,
        desktop: 0,
        mobilePercentage: 0
    });
    const [loadingDevices, setLoadingDevices] = useState(true);

    // Date Filter State (Default: Last 30 Days)
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date()
    });

    // Helper to format date params
    const getDateParams = () => {
        if (!dateRange?.from) return '';
        const params = new URLSearchParams();
        params.append('startDate', dateRange.from.toISOString());
        if (dateRange.to) {
            params.append('endDate', dateRange.to.toISOString());
        } else {
            params.append('endDate', dateRange.from.toISOString()); // Single day fallback
        }
        return `?${params.toString()}`;
    };

    // Category Widget State
    const [categories, setCategories] = useState<Category[]>([]);
    const [catPage, setCatPage] = useState(1);
    const [catTotal, setCatTotal] = useState(0);
    const [loadingCat, setLoadingCat] = useState(false);
    const [loading, setLoading] = useState(true);
    // Individual refresh states for each card
    const [refreshingVisitors, setRefreshingVisitors] = useState(false);
    const [refreshingBooks, setRefreshingBooks] = useState(false);
    const [refreshingActivity, setRefreshingActivity] = useState(false);
    const [refreshingCheckout, setRefreshingCheckout] = useState(false);
    const [refreshingCategories, setRefreshingCategories] = useState(false);
    const [refreshingDevices, setRefreshingDevices] = useState(false);
    const [refreshingTraffic, setRefreshingTraffic] = useState(false);

    const CAT_LIMIT = 5;

    // Fetch Analytics Stats
    const fetchAnalyticsStats = async (cardType?: 'visitors' | 'books' | 'activity' | 'checkout') => {
        try {
            // Set loading state based on which card is refreshing
            if (cardType === 'visitors') setRefreshingVisitors(true);
            else if (cardType === 'books') setRefreshingBooks(true);
            else if (cardType === 'activity') setRefreshingActivity(true);
            else if (cardType === 'checkout') setRefreshingCheckout(true);
            else setLoading(true);

            const query = getDateParams();
            const response = await fetch(`/api/analytics/stats${query}`);
            const data = await response.json();

            setStats(prev => ({
                visitors: data.totalVisitors ?? prev.visitors,
                visitorChange: data.visitorChange ?? prev.visitorChange,
                books: data.totalBooks ?? prev.books,
                categories: prev.categories,
                activity: data.totalActivity ?? prev.activity,
                activityChange: data.activityChange ?? prev.activityChange,
                checkout: data.totalCheckout ?? prev.checkout,
                checkoutChange: data.checkoutChange ?? prev.checkoutChange
            }));
        } catch (error) {
            console.error('Failed to fetch analytics stats', error);
        } finally {
            setLoading(false);
            setRefreshingVisitors(false);
            setRefreshingBooks(false);
            setRefreshingActivity(false);
            setRefreshingCheckout(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsStats();
    }, [dateRange]);

    const handleRefreshVisitors = () => {
        console.log('[Dashboard] Refreshing visitors...');
        fetchAnalyticsStats('visitors');
    };
    const handleRefreshBooks = () => {
        console.log('[Dashboard] Refreshing books...');
        fetchAnalyticsStats('books');
    };
    const handleRefreshActivity = () => {
        console.log('[Dashboard] Refreshing activity...');
        fetchAnalyticsStats('activity');
    };
    const handleRefreshCheckout = () => {
        console.log('[Dashboard] Refreshing checkout...');
        fetchAnalyticsStats('checkout');
    };

    // Fetch Traffic Data
    useEffect(() => {
        async function fetchTrafficData() {
            try {
                setLoadingTraffic(true);
                const query = getDateParams();
                const response = await fetch(`/api/analytics/traffic${query}`);
                const result = await response.json();
                setTrafficData(result.data || []);
            } catch (error) {
                console.error('Failed to fetch traffic data', error);
            } finally {
                setLoadingTraffic(false);
            }
        }
        fetchTrafficData();
    }, [dateRange]);

    // Fetch Device Statistics
    useEffect(() => {
        async function fetchDeviceStats() {
            try {
                setLoadingDevices(true);
                const query = getDateParams();
                const response = await fetch(`/api/analytics/devices${query}`);
                const data = await response.json();
                setDeviceData({
                    mobile: data.mobile || 0,
                    desktop: data.desktop || 0,
                    mobilePercentage: data.mobilePercentage || 0
                });
            } catch (error) {
                console.error('Failed to fetch device stats', error);
            } finally {
                setLoadingDevices(false);
            }
        }
        fetchDeviceStats();
    }, [dateRange]);

    // Fetch Categories for Widget with Pagination
    useEffect(() => {
        async function fetchCategories() {
            setLoadingCat(true);
            try {
                // Determine if we should filter categories by date logic (likely not supported yet, but passed just in case)
                // const query = getDateParams(); 
                // Using existing pagination logic
                const res = await categoryService.getAll({ page: catPage, limit: CAT_LIMIT, sortBy: 'popular' });
                setCategories(res.data as any);
                setCatTotal(res.pagination?.total ?? 0);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            } finally {
                setLoadingCat(false);
            }
        }
        fetchCategories();
    }, [catPage, dateRange]); // Refetch if needed, though likely static

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

    // Category refresh handler
    const handleRefreshCategories = async () => {
        setRefreshingCategories(true);
        try {
            const res = await categoryService.getAll({ page: catPage, limit: CAT_LIMIT, sortBy: 'popular' });
            setCategories(res.data as any);
            setCatTotal(res.pagination?.total ?? 0);
        } catch (error) {
            console.error('Failed to refresh categories', error);
        } finally {
            setRefreshingCategories(false);
        }
    };

    // Device stats refresh handler
    const handleRefreshDevices = async () => {
        setRefreshingDevices(true);
        try {
            const query = getDateParams();
            const response = await fetch(`/api/analytics/devices${query}`);
            const data = await response.json();
            setDeviceData({
                mobile: data.mobile || 0,
                desktop: data.desktop || 0,
                mobilePercentage: data.mobilePercentage || 0
            });
        } catch (error) {
            console.error('Failed to refresh device stats', error);
        } finally {
            setRefreshingDevices(false);
        }
    };

    // Traffic refresh handler
    const handleRefreshTraffic = async () => {
        setRefreshingTraffic(true);
        try {
            const query = getDateParams();
            const response = await fetch(`/api/analytics/traffic${query}`);
            const result = await response.json();
            setTrafficData(result.data || []);
        } catch (error) {
            console.error('Failed to refresh traffic data', error);
        } finally {
            setRefreshingTraffic(false);
        }
    };

    return (
        <AdminLayout
            title="Ringkasan Analisis"
            dateRange={dateRange}
            setDateRange={setDateRange}
        >
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
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-[200px] rounded-2xl bg-gray-200/50" />
                            ))
                        ) : (
                            <>
                                {/* Visitor Card */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    className="bg-white rounded-2xl z-50 border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 h-[200px] flex flex-col justify-between"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-gray-700 text-lg">Total Pengunjung</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRefreshVisitors();
                                                }}
                                                className="p-1 rounded-full hover:bg-gray-100 transition-all"
                                            >
                                                <RefreshCw
                                                    className={`w-4 h-4 ${refreshingVisitors ? 'animate-spin text-[#ffcc00]' : 'text-gray-400 hover:text-gray-600'}`}
                                                />
                                            </button>
                                            <div className="p-2 rounded-full bg-[#ffcc00] text-white">
                                                <Users className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {refreshingVisitors ? (
                                            <>
                                                <Skeleton className="h-10 w-24 mb-2 bg-gray-200/50" />
                                                <Skeleton className="h-4 w-48 bg-gray-200/50" />
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-4xl font-bold text-[#2f2f2f] mb-2">{stats.visitors.toLocaleString('id-ID')}</h3>
                                                <p className="text-sm">
                                                    <span className={stats.visitorChange < 0 ? "text-red-500" : "text-green-500"}>
                                                        {stats.visitorChange >= 0 ? '+' : ''}{stats.visitorChange.toFixed(2)}%
                                                    </span>{' '}
                                                    <span className="text-gray-500">
                                                        {stats.visitorChange < 0 ? 'Pengunjung lebih sedikit dari biasanya' : 'Pengunjung lebih banyak dari biasanya'}
                                                    </span>
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Book Card */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    className="bg-white rounded-2xl border z-50 border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 h-[200px] flex flex-col justify-between"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-gray-700 text-lg">Total Buku</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRefreshBooks();
                                                }}
                                                className="p-1 rounded-full hover:bg-gray-100 transition-all"
                                            >
                                                <RefreshCw
                                                    className={`w-4 h-4 ${refreshingBooks ? 'animate-spin text-[#ffcc00]' : 'text-gray-400 hover:text-gray-600'}`}
                                                />
                                            </button>
                                            <div className="p-2 rounded-full bg-[#ffcc00] text-white">
                                                <Book className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {refreshingBooks ? (
                                            <>
                                                <Skeleton className="h-10 w-24 mb-2 bg-gray-200/50" />
                                                <Skeleton className="h-4 w-48 bg-gray-200/50" />
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-4xl font-bold text-[#2f2f2f] mb-2">{stats.books.toLocaleString('id-ID')}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Total Buku yang telah di upload
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Activity Card */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 h-[200px] flex flex-col justify-between"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-gray-700 text-lg">Aktifitas Bulan Ini</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRefreshActivity();
                                                }}
                                                className="p-1 rounded-full hover:bg-gray-100 transition-all"
                                            >
                                                <RefreshCw
                                                    className={`w-4 h-4 ${refreshingActivity ? 'animate-spin text-[#ffcc00]' : 'text-gray-400 hover:text-gray-600'}`}
                                                />
                                            </button>
                                            <div className="p-2 rounded-full bg-[#ffcc00] text-white">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {refreshingActivity ? (
                                            <>
                                                <Skeleton className="h-10 w-24 mb-2 bg-gray-200/50" />
                                                <Skeleton className="h-4 w-48 bg-gray-200/50" />
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-4xl font-bold text-[#2f2f2f] mb-2">{stats.activity}</h3>
                                                <p className="text-sm">
                                                    <span className={stats.activityChange < 0 ? "text-red-500" : "text-green-500"}>
                                                        {stats.activityChange >= 0 ? '+' : ''}{stats.activityChange.toFixed(2)}%
                                                    </span>{' '}
                                                    <span className="text-gray-500">
                                                        {stats.activityChange < 0 ? 'Aktivitas lebih sedikit dari biasanya' : 'Lebih banyak Aktifitas dari biasanya'}
                                                    </span>
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Check Out Card */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="bg-white rounded-xl p-6 h-[200px] flex flex-col justify-between shadow-none border-none"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-gray-700 text-lg">Check Out</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRefreshCheckout();
                                                }}
                                                className="p-1 rounded-full hover:bg-gray-100 transition-all"
                                            >
                                                <RefreshCw
                                                    className={`w-4 h-4 ${refreshingCheckout ? 'animate-spin text-[#ffcc00]' : 'text-gray-400 hover:text-gray-600'}`}
                                                />
                                            </button>
                                            <div className="p-2 rounded-full bg-[#ffcc00] text-white">
                                                <ShoppingBag className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {refreshingCheckout ? (
                                            <>
                                                <Skeleton className="h-10 w-24 mb-2 bg-gray-200/50" />
                                                <Skeleton className="h-4 w-48 bg-gray-200/50" />
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-4xl font-bold text-[#2f2f2f] mb-2">{stats.checkout}</h3>
                                                <p className="text-sm">
                                                    <span className={stats.checkoutChange < 0 ? "text-red-500" : "text-green-500"}>
                                                        {stats.checkoutChange >= 0 ? '+' : ''}{stats.checkoutChange.toFixed(2)}%
                                                    </span>{' '}
                                                    <span className="text-gray-500">
                                                        {stats.checkoutChange < 0 ? 'Aktivitas lebih sedikit dari biasanya' : 'Aktivitas lebih banyak dari biasanya'}
                                                    </span>
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Right Column (1/3) - Category List (Dynamic) */}
                    <div className="flex  flex-col gap-6  lg:col-span-1">
                        {/* Date Filter */}


                        <div className="bg-white rounded-xl z-50 shadow-sm border border-gray-100 p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-gray-700 text-lg">Kategori Buku</h3>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRefreshCategories();
                                    }}
                                    className="p-1 rounded-full hover:bg-gray-100 transition-all"
                                >
                                    <RefreshCw
                                        className={`w-4 h-4 ${refreshingCategories ? 'animate-spin text-[#ffcc00]' : 'text-gray-400 hover:text-gray-600'}`}
                                    />
                                </button>
                            </div>
                            <div className="space-y-1 flex-1">
                                {(loadingCat || refreshingCategories) ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between py-2">
                                            <Skeleton className="h-4 w-[60%] bg-gray-200/50" />
                                            <Skeleton className="h-6 w-8 rounded-full bg-gray-200/50" />
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        {categories.map((cat, i) => (
                                            <div key={i} className="flex items-center justify-between py-1">
                                                <span className="text-gray-700 font-medium truncate flex-1">{cat.name}</span>
                                                {/* Random count as placeholder logic from original */}
                                                <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm font-medium text-gray-600 min-w-[40px] text-center">
                                                    {(cat as any)._count?.books ?? Math.floor(Math.random() * 20) + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </>
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
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRefreshTraffic();
                                }}
                                className="p-1 rounded-full hover:bg-gray-100 transition-all"
                            >
                                <RefreshCw
                                    className={`w-4 h-4 ${refreshingTraffic ? 'animate-spin text-[#ffcc00]' : 'text-gray-400 hover:text-gray-600'}`}
                                />
                            </button>
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
                                    {(loadingTraffic || refreshingTraffic) ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={i} className="border-b border-gray-50 last:border-0">
                                                <td className="py-4"><Skeleton className="h-4 w-32 bg-gray-200/50" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-12 ml-auto bg-gray-200/50" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-12 ml-auto bg-gray-200/50" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-16 ml-auto bg-gray-200/50" /></td>
                                                <td className="py-4"><Skeleton className="h-4 w-16 ml-auto bg-gray-200/50" /></td>
                                            </tr>
                                        ))
                                    ) : (
                                        trafficData.map((row, i) => (
                                            <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                                <td className="py-4 text-gray-700">{row.source}</td>
                                                <td className="py-4 text-right text-gray-500">{row.users}</td>
                                                <td className="py-4 text-right text-gray-500">{row.sessions}</td>
                                                <td className="py-4 text-right font-medium text-gray-700">{row.bounceRate}%</td>
                                                <td className="py-4 text-right text-gray-500">{row.avgDuration}</td>
                                            </tr>
                                        ))
                                    )}
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
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-700 text-lg">Mobile Sessions</h3>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRefreshDevices();
                                }}
                                className="p-1 rounded-full hover:bg-gray-100 transition-all"
                            >
                                <RefreshCw
                                    className={`w-4 h-4 ${refreshingDevices ? 'animate-spin text-[#ffcc00]' : 'text-gray-400 hover:text-gray-600'}`}
                                />
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm mb-8">Persentase pengguna yang menggunakan perangkat seluler dibandingkan dengan perangkat lain.</p>

                        <div className="flex-1 flex items-center justify-center relative">
                            {(loadingDevices || refreshingDevices) ? (
                                <Skeleton className="w-48 h-48 rounded-full bg-gray-200/50" />
                            ) : (
                                /* CSS Conic Gradient Donut */
                                <div className="w-48 h-48 rounded-full relative" style={{
                                    background: `conic-gradient(#ffcc00 0% ${deviceData.mobilePercentage}%, #e5e7eb ${deviceData.mobilePercentage}% 100%)`
                                }}>
                                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                                        <span className="text-4xl font-bold text-[#2f2f2f]">{deviceData.mobilePercentage.toFixed(0)}%</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center gap-8 mt-8">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#ffcc00] rounded-sm"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Mobile</span>
                                    <span className="text-sm font-bold text-[#2f2f2f]">{deviceData.mobile}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Desktop</span>
                                    <span className="text-sm font-bold text-[#2f2f2f]">{deviceData.desktop}</span>
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
