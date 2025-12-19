'use client';

import { Menu, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppState } from "@/contexts/AppStateContext";
import { motion, AnimatePresence } from "framer-motion";
import { Book } from "../types/book";
import BookDetailModal from "./BookDetailModal";
import { SearchIcon, CartIcon, UserIcon } from "./ui/icons";


export default function Header() {
  const pathname = usePathname();
  const { cart, isLoggedIn } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced Search Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        try {
          // Format price if needed in API, but simpler to just fetch
          const res = await fetch(`/api/books?search=${encodeURIComponent(searchQuery)}&limit=5`);
          const data = await res.json();
          // Map API data to Book type if needed (assuming API returns flexible data, but let's be safe)
          // The API returns 'data' array. Ideally we map it to our frontend Book type if structure differs.
          // Based on previous work, we might need mapping, but let's assume direct usage for now or do basic mapping.
          const mappedBooks = data.data.map((b: any) => ({
            ...b,
            priceFormatted: `Rp${b.price.toLocaleString('id-ID')}`,
            category: b.category?.name || 'Lainnya' // Handle category structure
          }));
          setSearchResults(mappedBooks);
        } catch (error) {
          console.error("Search failed", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

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

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  return (
    <>
      {/* MOBILE NAVBAR */}
      <header role="banner" aria-label="Header navigasi mobile" className="lg:hidden sticky top-0 left-0 right-0 z-50 h-[87px] bg-white flex items-center justify-between px-6 shadow-sm">
        <Link href="/" className="relative h-[37px] w-[40px] shrink-0">
          <Image
            src="/img/logo.png"
            alt="Pustaka Setia"
            fill
            className="object-contain"
            sizes="40px"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative size-[24px]" aria-label="Keranjang belanja">
            <CartIcon />
            {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
          <button
            className="flex items-center justify-center size-[24px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-[20px] w-[20px] text-[#2f2f2f]" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-[87px] left-0 right-0 bg-white border-t border-gray-200 pb-4 pt-4 px-[25px] shadow-lg">
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
      <header role="banner" aria-label="Header navigasi utama" className={`hidden lg:block w-full bg-white sticky top-0 z-50 border-b border-gray-200 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex-shrink-0 relative h-12 w-32">
              <Image
                src="/img/logo.png"
                alt="Pustaka Setia"
                fill
                className="object-contain object-left"
                priority
                sizes="(max-width: 1280px) 100vw, 150px"
              />
            </Link>

            <nav className="flex items-center gap-8 xl:gap-12">
              <Link href="/" className="relative flex flex-col gap-1 items-center group">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Beranda</p>
                {currentPage === "home" && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute -bottom-2 bg-[#ffcc00] h-[3px] w-[40px]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
              <Link href="/about" className="relative flex flex-col gap-1 items-center group font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap hover:opacity-70 transition-opacity">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Tentang Kami</p>
                {currentPage === "about" && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute -bottom-2 bg-[#ffcc00] h-[3px] w-[40px]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
              <Link href="/products" className="relative flex flex-col gap-1 items-center group font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap hover:opacity-70 transition-opacity">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Produk</p>
                {currentPage === "products" && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute -bottom-2 bg-[#ffcc00] h-[3px] w-[40px]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
              <Link href="/contact" className="relative flex flex-col gap-1 items-center group font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap hover:opacity-70 transition-opacity">
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg xl:text-xl whitespace-nowrap">Kontak Kami</p>
                {currentPage === "contact" && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute -bottom-2 bg-[#ffcc00] h-[3px] w-[40px]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            </nav>

            <div className="flex items-center gap-4 relative">
              {/* ANIMATED SEARCH BAR */}
              <div className="relative z-50">
                <motion.div
                  initial={false}
                  animate={{
                    width: isSearchOpen ? 300 : 40,
                    backgroundColor: isSearchOpen ? "#ffffff" : "transparent",
                    borderColor: isSearchOpen ? "#ffcc00" : "transparent",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`flex items-center border-2 rounded-full overflow-hidden ${isSearchOpen ? 'px-4' : 'px-0 justify-center'} h-[40px]`}
                >
                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.input
                        ref={searchInputRef}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "100%" }}
                        exit={{ opacity: 0, width: 0 }}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari buku..."
                        className="bg-transparent border-none outline-none text-sm font-['Poppins',sans-serif] text-neutral-800 placeholder:text-neutral-400 min-w-0 flex-1 mr-2"
                      />
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => {
                      if (isSearchOpen && searchQuery) {
                        // Optional: Trigger search explicitly if needed, currently live
                        // setSearchQuery(""); 
                      }
                      setIsSearchOpen(!isSearchOpen);
                      if (!isSearchOpen) {
                        // Focus deferred logic is in useEffect
                        setTimeout(() => searchInputRef.current?.focus(), 100);
                      }
                    }}
                    className="flex shrink-0 items-center justify-center size-[24px] hover:opacity-70 transition-opacity focus:outline-none"
                    aria-label="Toggle search"
                  >
                    {isSearchOpen ? <X className="size-[18px] text-[#2f2f2f]" /> : <SearchIcon />}
                  </button>
                </motion.div>

                {/* Dropdown Results */}
                <AnimatePresence>
                  {isSearchOpen && (isSearching || searchResults.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-3 w-[300px] bg-white border border-neutral-200 rounded-xl shadow-2xl overflow-hidden z-[60]"
                    >
                      {isSearching ? (
                        <div className="p-4 flex justify-center">
                          <Loader2 className="animate-spin h-5 w-5 text-[#ffcc00]" />
                        </div>
                      ) : (
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                          {/* Header */}
                          <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-100">
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-['Poppins',sans-serif]">Hasil Pencarian</p>
                          </div>
                          {searchResults.map((book) => (
                            <button
                              key={book.id}
                              onClick={() => {
                                setSelectedBook(book);
                                setIsSearchOpen(false); // Close search on selection
                                setSearchQuery("");
                                setSearchResults([]);
                              }}
                              className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 text-left border-b last:border-0 border-neutral-100 transition-colors group"
                            >
                              <div className="relative h-12 w-9 rounded overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                                <Image
                                  src={book.image}
                                  alt={book.title}
                                  fill
                                  className="object-cover"
                                  sizes="36px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-neutral-900 truncate font-['Poppins',sans-serif] group-hover:text-[#ffcc00] transition-colors">
                                  {book.title}
                                </h4>
                                <p className="text-xs text-neutral-500 truncate font-['Poppins',sans-serif]">
                                  {book.author}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/cart" className="hover:opacity-70 transition-opacity relative" aria-label="Keranjang belanja">
                <CartIcon />
                {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
              <Link href={isLoggedIn ? "/dashboard" : "/login"} className="hover:opacity-70 transition-opacity" aria-label={isLoggedIn ? "Dashboard akun" : "Login"}>
                <UserIcon />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* GLOBAL BOOK DETAIL MODAL */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}