'use client';

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalBooks: 0,
    totalSold: 0
  });

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        console.log(data)
        if (data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-[#F5F5F5] overflow-hidden">
        <div className="relative max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Left Content */}
            <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 px-4 md:px-8 lg:px-16 pt-12 pb-2 md:py-16 lg:py-20 w-full lg:w-1/2 z-10 relative bg-white lg:bg-transparent">
              {/* Heading with Slide Animation */}
              <div className="flex justify-center lg:justify-start w-full">
                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="font-['Poppins',sans-serif] font-semibold text-3xl md:text-5xl lg:text-[64px] md:leading-[1.2] text-neutral-900 text-left"
                >
                  Jelajahi koleksi buku terbaik kami untuk Anda
                </motion.h1>
              </div>

              {/* Description */}
              <p className="font-['Poppins',sans-serif] text-sm md:text-lg lg:text-[20px] text-neutral-700 leading-relaxed max-w-lg lg:max-w-none">
                Pustaka Setia menghadirkan berbagai koleksi buku untuk memberikan ilmu yang mendalam dan bacaan bermakna. Temukan inspirasi baru melalui pilihan buku terbaik kami.
              </p>

              {/* CTA Button */}
              <button
                onClick={() => router.push('/products')}
                className="font-['Poppins',sans-serif] font-semibold bg-[#ffcc00] hover:bg-[#f0c000] text-neutral-900 text-base md:text-[20px] px-8 py-3 md:px-10 md:py-4 rounded-full w-fit transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Jelajahi Sekarang
              </button>
            </div>

            {/* Right Hero Image */}
            <div className="relative w-full lg:w-1/2 overflow-hidden h-[400px] lg:h-[700px] lg:pr-0 flex items-end justify-center lg:justify-end pb-0">
              <motion.img
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                src="/img/hand-hero-section.png"
                alt="Koleksi Buku Pustaka Setia"
                className="w-full h-full lg:w-auto right-0 lg:h-[800px] object-contain object-bottom transform lg:translate-x-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Horizontal Layout */}
      <section className="w-full z-50 relative -mt-5 pb-5 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 w-full">
          {/* White card with shadow */}
          <div className="bg-white rounded-[20px] p-6 md:p-8 lg:p-12 shadow-lg">
            {/* Horizontal flex layout */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8">

              {/* Stat 1 - Kategori Ekslusif */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#5a4fcf] text-[40px] font-bold leading-none font-['Poppins',sans-serif]">
                    {stats.totalCategories > 0 ? stats.totalCategories : 8}+
                  </span>
                  <span className="text-[#5a4fcf] text-[18px] font-semibold font-['Poppins',sans-serif]">
                    Kategori Ekslusif
                  </span>
                </div>
                <p className="text-[#8a8a8a] text-[16px] font-['Poppins',sans-serif]">
                  Koleksi pilihan untuk memperkaya wawasan anda
                </p>
              </div>

              {/* Stat 2 - Pengiriman Cepat & Aman */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-[#5a4fcf] text-[18px] font-semibold font-['Poppins',sans-serif]">
                  Pengiriman Cepat & Aman
                </h3>
                <p className="text-[#8a8a8a] text-[16px] font-['Poppins',sans-serif]">
                  Kami menjaga setiap langkah pengiriman dengan penuh perhatian
                </p>
              </div>

              {/* Stat 3 - Mutu Terjamin */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-[#5a4fcf] text-[18px] font-semibold font-['Poppins',sans-serif]">
                  Mutu Terjamin
                </h3>
                <p className="text-[#8a8a8a] text-[16px] font-['Poppins',sans-serif]">
                  Buku-buku berkualitas tinggi untuk pengalaman membaca terbaik
                </p>
              </div>

              {/* Vertical Separator */}
              <div className="hidden lg:block w-[1px] h-auto bg-gray-200 self-stretch" />

              {/* Stat 4 - Total Buku Tersedia */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#5a4fcf] text-[40px] font-bold leading-none font-['Poppins',sans-serif]">
                    {stats.totalBooks > 0 ? stats.totalBooks : 100}+
                  </span>
                  <span className="text-[#5a4fcf] text-[18px] font-semibold font-['Poppins',sans-serif]">
                    Total Buku Tersedia
                  </span>
                </div>
                <p className="text-[#8a8a8a] text-[16px] font-['Poppins',sans-serif]">
                  Temukan buku-buku yang akan memperluas wawasan Anda
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
