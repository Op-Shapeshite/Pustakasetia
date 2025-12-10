'use client';

import { useState, useEffect } from 'react';

export default function Stats() {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.data) {
          setTotalBooks(data.data.totalBooks || 0);
          setTotalCategories(data.data.totalCategories || 0);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="relative w-full py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dark background wrapper */}
        <div className="bg-[#1a1a2e] rounded-[20px] p-4 md:p-6">
          {/* White card with stats */}
          <div className="bg-white rounded-[16px] p-6 md:p-8 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

              {/* Stat 1 - Kategori Ekslusif */}
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#5a4fcf] text-3xl md:text-4xl font-bold">
                    {totalCategories > 0 ? totalCategories : 8}+
                  </span>
                  <span className="text-gray-800 text-lg md:text-xl font-semibold">
                    Kategori Ekslusif
                  </span>
                </div>
                <p className="text-gray-500 text-sm md:text-base">
                  Koleksi pilihan untuk memperkaya wawasan anda
                </p>
              </div>

              {/* Stat 2 - Pengiriman Cepat & Aman */}
              <div className="flex flex-col gap-2">
                <h3 className="text-gray-800 text-lg md:text-xl font-semibold">
                  Pengiriman Cepat & Aman
                </h3>
                <p className="text-gray-500 text-sm md:text-base">
                  Kami menjaga setiap langkah pengiriman dengan penuh perhatian
                </p>
              </div>

              {/* Stat 3 - Mutu Terjamin */}
              <div className="flex flex-col gap-2">
                <h3 className="text-gray-800 text-lg md:text-xl font-semibold">
                  Mutu Terjamin
                </h3>
                <p className="text-gray-500 text-sm md:text-base">
                  Buku-buku berkualitas tinggi untuk pengalaman membaca terbaik
                </p>
              </div>

              {/* Stat 4 - Total Buku Tersedia */}
              <div className="flex flex-col gap-2 lg:border-l lg:border-gray-200 lg:pl-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#5a4fcf] text-3xl md:text-4xl font-bold">
                    {totalBooks > 0 ? totalBooks : 100}+
                  </span>
                  <span className="text-gray-800 text-lg md:text-xl font-semibold">
                    Total Buku Tersedia
                  </span>
                </div>
                <p className="text-gray-500 text-sm md:text-base">
                  Temukan buku-buku yang akan memperluas wawasan Anda
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
