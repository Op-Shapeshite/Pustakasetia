'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: 'SOLNA D-300 - 4 Pages Offset',
        image: '/img/slider/solna-d-300.png',
        description: 'Mesin Web Offset Berkecepatan Tinggi',
        detail: 'Mesin ini dapat mencetak tabloid dan buku 64 halaman full colours menggunakan kertas HVS/HVO. Dengan kecepatan cetak 20.000 eksemplar per jam.'
    },
    {
        id: 2,
        title: 'Heidelberg Speedmaster',
        image: '/img/slider/heidelberg-speedmaster.png',
        description: 'Standar Kualitas Cetak Premium',
        detail: 'Mesin cetak offset sheet-fed dengan teknologi presisi tinggi untuk hasil cetak separasi warna yang tajam dan konsisten pada berbagai media kertas.'
    },
    {
        id: 3,
        title: 'Mesin Binding & Finishing',
        image: '/img/slider/mesin-binding.png',
        description: 'Penyelesaian Akhir yang Presisi',
        detail: 'Dilengkapi dengan sistem binding otomatis (perfect binding) dan pemotongan 3 sisi untuk menjamin kualitas jilid buku yang kuat dan rapi.'
    },
    {
        id: 4,
        title: 'Mesin Lipat (Folding Machine)',
        image: '/img/slider/mesin-lipat.png',
        description: 'Efisiensi Pelipatan Dokumen',
        detail: 'Mesin pelipat kertas otomatis dengan presisi tinggi untuk berbagai ukuran kertas, mempercepat proses finishing produksi buku dan brosur.'
    },
    {
        id: 5,
        title: 'Mesin Potong Kertas Digital',
        image: '/img/slider/mesin-potong.png',
        description: 'Akurasi Pemotongan Tinggi',
        detail: 'Menggunakan teknologi pemotongan digital yang dapat diprogram untuk memastikan setiap potongan kertas presisi sesuai ukuran yang diinginkan.'
    },
    {
        id: 6,
        title: 'Pre-Press CTP System',
        image: '/img/slider/pre-press-ctp.png',
        description: 'Computer to Plate Technology',
        detail: 'Teknologi pembuatan pelat cetak langsung dari komputer, meminimalkan kesalahan dan meningkatkan ketajaman hasil cetak sejak tahap awal.'
    },
    {
        id: 7,
        title: 'Mesin Laminasi Thermal',
        image: '/img/slider/mesin-laminasi.png',
        description: 'Perlindungan & Estetika',
        detail: 'Memberikan lapisan pelindung (doff/glossy) pada cover buku untuk daya tahan lebih lama dan tampilan yang lebih eksklusif.'
    },
    {
        id: 8,
        title: 'Mesin Jahit Kawat',
        image: '/img/slider/mesin-jahit-kawat.png',
        description: 'Jilid Kawat yang Kuat',
        detail: 'Digunakan untuk penjilidan majalah atau buku tipis dengan kecepatan tinggi dan hasil jilidan yang kuat serta rapi.'
    },
    {
        id: 9,
        title: 'Mesin Lem Panas (Glue Binding)',
        image: '/img/slider/mesin-lem-panas.png',
        description: 'Penjilidan Buku Tebal',
        detail: 'Teknologi perekat lem panas kualitas tinggi untuk menjilid buku tebal agar tidak mudah lepas dan tahan lama.'
    },
    {
        id: 10,
        title: 'Quality Control Unit',
        image: '/img/slider/quality-control.png',
        description: 'Pemeriksaan Akhir Ketat',
        detail: 'Unit khusus pemeriksaan kualitas untuk memastikan setiap produk yang keluar dari percetakan memenuhi standar kelayakan 100%.'
    },
    {
        id: 11,
        title: 'Gudang Penyimpanan Modern',
        image: '/img/slider/gudang-penyimpanan.png',
        description: 'Manajemen Stok Terpadu',
        detail: 'Fasilitas penyimpanan luas dengan sistem manajemen inventaris modern untuk menjaga kondisi kertas dan hasil cetak tetap prima.'
    }
];

export default function SlidingContent() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const paginate = (newDirection: number) => {
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = slides.length - 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            return nextIndex;
        });
    };

    return (
        <section className="w-full py-12 md:py-20 lg:py-24 bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="mb-12 md:mb-16 max-w-4xl">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-['Poppins',sans-serif] text-neutral-900 mb-6 leading-tight">
                        Fasilitas Produksi PUSTAKA SETIA
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-600 leading-relaxed">
                        Hingga tahun 2012, PUSTAKA SETIA telah memiliki berbagai macam alat produksi yang dioperasikan secara terpadu di Kawasan Percetakan PUSTAKA SETIA.
                    </p>
                    <div className="h-1.5 w-32 bg-[#FFCC00] mt-6" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                    {/* Left Section: Single Active Image */}
                    <div className="relative h-[400px] lg:h-[500px] w-full rounded-[32px] overflow-hidden shadow-2xl bg-neutral-100 order-1">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentIndex}
                                src={slides[currentIndex].image}
                                alt={slides[currentIndex].title}
                                className="absolute inset-0 w-full h-full object-cover"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            />
                        </AnimatePresence>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Right Section: Content */}
                    <div className="flex flex-col justify-center space-y-8 order-2 h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-6"
                            >
                                <h3 className="text-2xl md:text-3xl font-bold font-['Poppins',sans-serif] text-neutral-900">
                                    {slides[currentIndex].title}
                                </h3>

                                <p className="text-xl md:text-2xl text-neutral-800 font-medium leading-relaxed">
                                    {slides[currentIndex].description}
                                </p>

                                <p className="text-base md:text-lg text-neutral-500 leading-relaxed text-justify">
                                    {slides[currentIndex].detail}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Controls */}
                        <div className="flex items-center gap-6 pt-4 border-t border-neutral-100 mt-auto">
                            <span className="text-4xl font-light text-[#FFCC00]">
                                0{currentIndex + 1}
                            </span>

                            <div className="flex gap-2 flex-1">
                                {slides.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-[#FFCC00]' : 'bg-neutral-200'
                                            }`}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => paginate(-1)}
                                    className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-[#FFCC00] hover:text-white transition-all duration-300 group"
                                >
                                    <ArrowLeft className="w-6 h-6 text-neutral-900 group-hover:text-white transition-colors" />
                                </button>
                                <button
                                    onClick={() => paginate(1)}
                                    className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-[#FFCC00] hover:text-white transition-all duration-300 group"
                                >
                                    <ArrowRight className="w-6 h-6 text-neutral-900 group-hover:text-white transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neutral-50 rounded-tr-[100px] -z-10" />
        </section>
    );
}
