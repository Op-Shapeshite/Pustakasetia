'use client';

import svgPaths from "../imports/svg-zx896x9umy";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAppState } from "@/contexts/AppStateContext";

function ProiconsSearch() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p24a4e880} stroke="#2F2F2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function SolarCart3Outline() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p627faf2} fill="#2F2F2F" />
          <path clipRule="evenodd" d={svgPaths.pa88b80} fill="#2F2F2F" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );
}

function MdiUserOutline() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.pba10b80} fill="#2F2F2F" />
        </g>
      </svg>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { cart, isLoggedIn } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        setIsVisible(false);
        isScrolling = true;
      }

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      const timeout = setTimeout(() => {
        setIsVisible(true);
        isScrolling = false;
      }, 150);

      setScrollTimeout(timeout);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  const cartCount = cart.length;

  const getCurrentPage = () => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/about')) return 'about';
    if (pathname.startsWith('/products')) return 'products';
    if (pathname.startsWith('/contact')) return 'contact';
    if (pathname.startsWith('/cart')) return 'cart';
    if (pathname.startsWith('/login')) return 'login';
    if (pathname.startsWith('/dashboard')) return 'dashboard';
    return 'home';
  };

  const currentPage = getCurrentPage();

  return (
    <>
      {/* MOBILE NAVBAR */}
      <header className="lg:hidden absolute top-0 left-0 right-0 z-50 h-[87px] bg-neutral-50">
        <Link href="/" className="absolute left-[25px] top-[25px] h-[37px] w-[40px]">
          <img
            src="/img/logo.png"
            alt="Pustaka Setia"
            className="size-full object-contain"
          />
        </Link>

        <div className="absolute flex gap-[16px] h-[23px] items-center left-[270px] top-[32px]">
          <button className="size-[24px]">
            <ProiconsSearch />
          </button>
          <Link href="/cart" className="relative size-[24px]">
            <SolarCart3Outline />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <button
          className="absolute flex items-center justify-center h-[23px] left-[234px] top-[32px] w-[131px]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-[17.67px] w-[19px] text-[#2f2f2f]" />
        </button>

        {mobileMenuOpen && (
          <div className="absolute top-[87px] left-0 right-0 bg-neutral-50 border-t border-gray-200 pb-4 pt-4 px-[25px]">
            <nav className="flex flex-col gap-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex flex-col gap-1 text-left">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f]">Beranda</p>
                {currentPage === "home" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="flex flex-col gap-1 text-left">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f]">Tentang Kami</p>
                {currentPage === "about" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
              </Link>
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="flex flex-col gap-1 text-left">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f]">Produk</p>
                {currentPage === "products" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="flex flex-col gap-1 text-left">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f]">Kontak Kami</p>
                {currentPage === "contact" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* DESKTOP NAVBAR */}
      <header className={`hidden lg:block w-full bg-neutral-50 sticky top-0 z-50 border-b border-gray-200 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex-shrink-0">
              <img
                src="/img/logo.png"
                alt="Pustaka Setia"
                className="h-16 w-auto object-contain"
              />
            </Link>

            <nav className="flex items-center gap-8 xl:gap-12">
              <Link href="/" className="flex flex-col gap-1 items-center">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Beranda</p>
                {currentPage === "home" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
              </Link>
              <Link href="/about" className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap hover:opacity-70 transition-opacity">
                <div className="flex flex-col gap-1 items-center">
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Tentang Kami</p>
                  {currentPage === "about" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
                </div>
              </Link>
              <Link href="/products" className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap hover:opacity-70 transition-opacity">
                <div className="flex flex-col gap-1 items-center">
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Produk</p>
                  {currentPage === "products" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
                </div>
              </Link>
              <Link href="/contact" className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap hover:opacity-70 transition-opacity">
                <div className="flex flex-col gap-1 items-center">
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Kontak Kami</p>
                  {currentPage === "contact" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
                </div>
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <button className="hover:opacity-70 transition-opacity">
                <ProiconsSearch />
              </button>
              <Link href="/cart" className="hover:opacity-70 transition-opacity relative">
                <SolarCart3Outline />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href={isLoggedIn ? "/dashboard" : "/login"} className="hover:opacity-70 transition-opacity">
                <MdiUserOutline />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}