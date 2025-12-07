'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
import svgPaths from "../imports/svg-va5qrc4oym";

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAppState();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      logout();
      router.push("/");
    }
  };

  return (
    <div className="bg-[#f6f8fd] min-h-screen w-full relative overflow-x-hidden">
      {/* Header Background */}
      <div className="absolute left-0 top-0 w-full h-[180px] md:h-[180px]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Logo - Top Left */}
      <div className="absolute left-[25px] top-[20px] z-50">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
          <img
            src="/img/logo.png"
            alt="Pustaka Setia"
            className="w-[45px] h-[45px] border-2 border-[#ffcc00] rounded-lg p-1 bg-white"
          />
          <p className="font-['Poppins',sans-serif] font-medium text-white text-lg">PUSTAKA SETIA</p>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden absolute right-[20px] top-[25px] z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
          <Menu className="w-[28px] h-[28px] text-white" />
        </button>
      </div>

      {/* Admin Profile - Bottom Left of Header */}
      <div className="absolute left-[25px] top-[90px] md:top-[100px] z-50">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
          <div className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center overflow-hidden">
            <svg className="w-[35px] h-[35px]" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="30" r="15" fill="#6b7280" />
              <path d="M15 70C15 55 25 45 40 45C55 45 65 55 65 70" stroke="#6b7280" strokeWidth="6" fill="none" />
            </svg>
          </div>
          <div>
            <p className="font-['Poppins',sans-serif] font-medium text-white text-base">Admin</p>
            <p className="font-['Poppins',sans-serif] text-white/80 text-xs">Admin Pustaka Setia</p>
          </div>
        </div>
      </div>

      {/* Ringkasan Analisis Title */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[25px] md:top-[30px] z-50 text-center">
        <h1 className="font-['Poppins',sans-serif] font-bold text-white text-3xl md:text-4xl whitespace-nowrap drop-shadow-lg">
          Ringkasan Analisis
        </h1>
      </div>

      {/* Date Picker - Top Right */}
      <div className="hidden md:flex absolute right-[25px] top-[25px] z-50 items-center gap-2 bg-white/95 backdrop-blur-sm border border-white/50 rounded-lg px-4 py-2 shadow-lg">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="#2f2f2f" />
        </svg>
        <p className="font-['Poppins',sans-serif] font-medium text-[#2f2f2f] text-sm">
          6 Okt - 12 Okt 2025
        </p>
        <svg className="w-4 h-4" viewBox="0 0 8 7" fill="none">
          <path d="M4 0L0 5h8L4 0z" fill="#2f2f2f" />
        </svg>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:static top-0 left-0 h-screen bg-white z-50
          transition-transform duration-300 w-[188px]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute top-4 right-4 text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          <div className="pt-[40px] px-[22px]">
            <p className="font-['Poppins',sans-serif] text-gray-500 text-sm mb-4">Main</p>

            <button className="flex items-center gap-3 w-full mb-4">
              <div className="w-6 h-6 bg-[#ffcc00] rounded-md flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <p className="font-['Poppins',sans-serif] font-medium text-[#2f2f2f] text-base">Dasbor</p>
            </button>

            <button className="flex items-center gap-3 w-full mb-4">
              <div className="w-6 h-6 bg-[#ffcc00] rounded-md flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                  <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                </svg>
              </div>
              <p className="font-['Poppins',sans-serif] font-medium text-[#2f2f2f] text-base">Buku</p>
            </button>

            <button className="flex items-center gap-3 w-full mb-4">
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#ffcc00" />
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="white" />
                </svg>
              </div>
              <p className="font-['Poppins',sans-serif] font-medium text-[#2f2f2f] text-base">Pengguna</p>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full mt-8"
            >
              <div className="w-6 h-6 bg-[#ef4444] rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4 text-white" />
              </div>
              <p className="font-['Poppins',sans-serif] font-medium text-[#ef4444] text-base">Logout</p>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pt-[230px] md:pt-[200px] px-4 md:px-8 pb-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Total Pengunjung */}
            <div className="bg-white rounded-2xl shadow-md p-6 relative">
              <div className="absolute right-6 top-6">
                <svg className="w-9 h-9" viewBox="0 0 37 37" fill="none">
                  <circle cx="18.5" cy="18.5" r="18.5" fill="#FFCC00" />
                  <path d="M16 21c1.66 0 2.99-1.34 2.99-3S17.66 15 16 15c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 15 8 15C6.34 15 5 16.34 5 18s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V29h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V29h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="white" opacity="0.5" />
                  <path d="M16 21c1.66 0 2.99-1.34 2.99-3S17.66 15 16 15c-1.66 0-3 1.34-3 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V29h14v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="white" />
                </svg>
              </div>
              <p className="font-['Poppins',sans-serif] font-medium text-[#2f2f2f] text-lg mb-6">
                Total Pengunjung
              </p>
              <p className="font-['Poppins',sans-serif] font-medium text-3xl text-black mb-3">
                1.598
              </p>
              <p className="font-['Poppins',sans-serif] text-sm">
                <span className="text-[#df0404]">-2,65%</span>{' '}
                <span className="text-gray-500">Pengunjung lebih sedikit dari biasanya</span>
              </p>
            </div>

            {/* Total Buku */}
            <div className="bg-white rounded-2xl shadow-md p-6 relative">
              <div className="absolute right-6 top-6">
                <svg className="w-9 h-9" viewBox="0 0 37 37" fill="none">
                  <circle cx="18.5" cy="18.5" r="18.5" fill="#FFCC00" />
                  <path d={svgPaths.p31161c00} fill="white" />
                </svg>
              </div>
              <p className="font-['Poppins',sans-serif] font-medium text-[#2f2f2f] text-lg mb-6">
                Total Buku
              </p>
              <p className="font-['Poppins',sans-serif] font-medium text-3xl text-black mb-3">
                10.642
              </p>
              <p className="font-['Poppins',sans-serif] text-sm text-gray-500">
                Total Buku yang telah di upload
              </p>
            </div>

            {/* Aktifitas Bulan Ini */}
            <div className="bg-white rounded-2xl shadow-md p-6 relative">
              <div className="absolute right-6 top-6">
                <svg className="w-9 h-9" viewBox="0 0 37 37" fill="none">
                  <circle cx="18.5" cy="18.5" r="18.5" fill="#FFCC00" />
                  <path d="M16 21c1.66 0 2.99-1.34 2.99-3S17.66 15 16 15c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 15 8 15C6.34 15 5 16.34 5 18s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V29h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V29h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="white" opacity="0.5" />
                  <path d="M16 21c1.66 0 2.99-1.34 2.99-3S17.66 15 16 15c-1.66 0-3 1.34-3 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V29h14v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="white" />
                </svg>
              </div>
              <p className="font-['Poppins',sans-serif] font-medium text-[#2f2f2f] text-lg mb-6">
                Aktifitas Bulan Ini
              </p>
              <p className="font-['Poppins',sans-serif] font-medium text-3xl text-black mb-3">
                941
              </p>
              <p className="font-['Poppins',sans-serif] text-sm">
                <span className="text-[#60d669]">4,25%</span>{' '}
                <span className="text-gray-500">Lebih banyak Aktifivas dari biasanya</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm">
              © 2025 PUSTAKA SETIA All right reserved
            </p>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}