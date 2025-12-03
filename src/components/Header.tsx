import svgPaths from "../imports/svg-zx896x9umy";
import imgPustakaSetiaTracing2 from "figma:asset/a236558e0f6a9a9f56ec11523f0449430ba96187.png";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { getCartItemCount } from "../utils/cartStorage";

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

export default function Header({ currentPage, onNavigate }: { currentPage: string; onNavigate: (page: "home" | "about" | "products" | "contact" | "cart") => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    updateCartCount();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  useEffect(() => {
    let isScrolling = false;

    const handleScroll = () => {
      // Hide navbar when scrolling
      if (!isScrolling) {
        setIsVisible(false);
        isScrolling = true;
      }

      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Show navbar after scrolling stops
      const timeout = setTimeout(() => {
        setIsVisible(true);
        isScrolling = false;
      }, 150); // Show navbar 150ms after scrolling stops

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

  const updateCartCount = () => {
    setCartCount(getCartItemCount());
  };

  return (
    <>
      {/* MOBILE NAVBAR - Figma Design */}
      <header className="lg:hidden absolute top-0 left-0 right-0 z-50 h-[87px] bg-neutral-50">
        {/* Logo */}
        <button onClick={() => onNavigate("home")} className="absolute left-[25px] top-[25px] h-[37px] w-[40px]">
          <img 
            src={imgPustakaSetiaTracing2} 
            alt="Pustaka Setia" 
            className="size-full object-cover"
          />
        </button>

        {/* Icons - Search & Cart */}
        <div className="absolute flex gap-[16px] h-[23px] items-center left-[270px] top-[32px]">
          <button className="size-[24px]">
            <ProiconsSearch />
          </button>
          <button onClick={() => onNavigate("cart")} className="relative size-[24px]">
            <SolarCart3Outline />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Hamburger Menu */}
        <button 
          className="absolute flex items-center justify-center h-[23px] left-[234px] top-[32px] w-[131px]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-[17.67px] w-[19px] text-[#2f2f2f]" />
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-[87px] left-0 right-0 bg-neutral-50 border-t border-gray-200 pb-4 pt-4 px-[25px]">
            <nav className="flex flex-col gap-4">
              <button onClick={() => { onNavigate("home"); setMobileMenuOpen(false); }} className="flex flex-col gap-1 text-left">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f]">Beranda</p>
                {currentPage === "home" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
              </button>
              <button onClick={() => { onNavigate("about"); setMobileMenuOpen(false); }} className="flex flex-col gap-1 text-left">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f]">Tentang Kami</p>
                {currentPage === "about" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
              </button>
              <button onClick={() => { onNavigate("products"); setMobileMenuOpen(false); }} className="flex flex-col gap-1 text-left">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f]">Produk</p>
                {currentPage === "products" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
              </button>
              <button onClick={() => { onNavigate("contact"); setMobileMenuOpen(false); }} className="flex flex-col gap-1 text-left">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f]">Kontak Kami</p>
                {currentPage === "contact" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* DESKTOP NAVBAR - Original Design */}
      <header className={`hidden lg:block w-full bg-neutral-50 sticky top-0 z-50 border-b border-gray-200 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <button onClick={() => onNavigate("home")} className="flex-shrink-0">
              <img 
                src={imgPustakaSetiaTracing2} 
                alt="Pustaka Setia" 
                className="h-16 w-auto object-contain"
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-8 xl:gap-12">
              <button onClick={() => onNavigate("home")} className="flex flex-col gap-1 items-center">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Beranda</p>
                {currentPage === "home" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
              </button>
              <button onClick={() => onNavigate("about")} className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap hover:opacity-70 transition-opacity">
                <div className="flex flex-col gap-1 items-center">
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Tentang Kami</p>
                  {currentPage === "about" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
                </div>
              </button>
              <button onClick={() => onNavigate("products")} className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap hover:opacity-70 transition-opacity">
                <div className="flex flex-col gap-1 items-center">
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Produk</p>
                  {currentPage === "products" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
                </div>
              </button>
              <button onClick={() => onNavigate("contact")} className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap hover:opacity-70 transition-opacity">
                <div className="flex flex-col gap-1 items-center">
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Kontak Kami</p>
                  {currentPage === "contact" && <div className="bg-[#ffcc00] h-[3px] w-[40px]" />}
                </div>
              </button>
            </nav>

            {/* Desktop Icons */}
            <div className="flex items-center gap-4">
              <button className="hover:opacity-70 transition-opacity">
                <ProiconsSearch />
              </button>
              <button onClick={() => onNavigate("cart")} className="hover:opacity-70 transition-opacity relative">
                <SolarCart3Outline />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="hover:opacity-70 transition-opacity">
                <MdiUserOutline />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}