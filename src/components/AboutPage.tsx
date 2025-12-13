'use client';

import { useState, useEffect } from 'react';
import Footer from "./Footer";
import SlidingContent from "./SlidingContent";
import { AboutPageSkeleton } from './ui';

const imgRectangle1304 = "/img/library-background.png";
const imgImage = "/img/book-cover-optimized.png";
const imgImage6 = "/img/book-cover-optimized.png";

export default function AboutPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for images
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AboutPageSkeleton />;
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={imgRectangle1304}
            alt="Books background"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <h1 className="font-['Poppins',sans-serif] text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 md:mb-6">
            Tentang - Pustaka setia
          </h1>
          <p className="font-['Poppins',sans-serif] text-[#fbfaf6] text-sm md:text-base lg:text-lg max-w-3xl leading-relaxed">
            Pustaka Setia adalah penerbit dan percetakan yang menghadirkan karya bermutu untuk meningkatkan produktivitas dan memberi makna bagi setiap pembaca.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-4 md:space-y-6">
              <p className="font-['Poppins',sans-serif] text-[#616161] text-sm md:text-base">
                #Tentang Kami
              </p>
              <h2 className="font-['Poppins',sans-serif] text-[#2f2f2f] text-3xl md:text-4xl lg:text-5xl">
                CV. Pustaka Setia
              </h2>
              <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg lg:text-xl leading-relaxed text-justify">
                PUSTAKA SETIA adalah perusahaan penerbitan dan percetakan yang berdiri sejak 1993, berbadan hukum CV dan terdaftar di IKAPI Jawa Barat. Berawal dari penerbitan buku pelajaran, perusahaan ini berkembang menerbitkan buku penunjang pendidikan untuk berbagai jenjang serta buku umum seperti cerita rakyat, kamus, filsafat, dan dakwah, dengan lebih dari 2.500 judul terbit hingga 2012. Didukung lebih dari 60 karyawan dan perwakilan di berbagai daerah, PUSTAKA SETIA terus memperluas jangkauan pemasaran dan meningkatkan fasilitas produksi, termasuk pembangunan dua gedung baru agar seluruh proses pracetak hingga finishing dapat berlangsung dalam satu lokasi.
              </p>
            </div>

            {/* Right Box - Image */}
            <div className="w-full h-[300px] md:h-[350px] lg:h-[426px]">
              <img
                src="/img/aboutus-pustakasetia.png"
                alt="Tentang Pustaka Setia"
                className="w-full h-full object-cover rounded-[24px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Legal dan Tercatat */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
              <div className="flex-shrink-0 w-32 md:w-40 lg:w-[174px]">
                <img
                  src="/img/legality.png"
                  alt="Legal Document"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="flex-1 space-y-3 text-center md:text-left">
                <h3 className="font-['Poppins',sans-serif] text-[#2f2f2f] text-xl md:text-2xl">
                  Legal dan Tercatat
                </h3>
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg lg:text-xl leading-relaxed text-justify md:text-justify">
                  CV. Pustaka Setia tercatat dengan legal dan memiliki akte resmi di Notaris Gina Riswara Koswara, S.H. Nomor 29/1993</p>
              </div>
            </div>

            {/* Kantor Pustaka Setia */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
              <div className="flex-shrink-0 w-32 md:w-40 lg:w-[163px]">
                <img
                  src="/img/office-location.png"
                  alt="Office Building"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="flex-1 space-y-3 text-center md:text-left">
                <h3 className="font-['Poppins',sans-serif] text-[#2f2f2f] text-xl md:text-2xl">
                  Kantor Pustaka Setia
                </h3>
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg lg:text-xl leading-relaxed text-justify md:text-justify">
                  CV. Pustaka Setia aktif berkantor di Jl. BKR No.162-164, Cigereleng, Kec. Regol, Kota Bandung, Jawa Barat 40253</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sliding Content Section */}
      <SlidingContent />

      {/* Footer */}
      <Footer />
    </div>
  );
}
