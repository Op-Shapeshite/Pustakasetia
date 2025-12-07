import svgPaths from "../imports/svg-zx896x9umy";
import Link from 'next/link';

function TablerCopyright() {
  return (
    <div className="size-[20px] inline-block">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g>
          <path d={svgPaths.p46f6530} stroke="#2F2F2F" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.p3fa2f700} stroke="#2F2F2F" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function LogosWhatsappIcon() {
  return (
    <div className="size-[30px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g clipPath="url(#clip0_1_9080)">
          <path d={svgPaths.p147e0f80} fill="url(#paint0_linear_1_9080)" />
          <path d={svgPaths.ped5ffc0} fill="url(#paint1_linear_1_9080)" />
          <path d={svgPaths.p3715e080} fill="white" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_9080" x1="1448.56" x2="1448.56" y1="2887.09" y2="0.519531">
            <stop stopColor="#1FAF38" />
            <stop offset="1" stopColor="#60D669" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_9080" x1="1500" x2="1500" y1="2990.08" y2="0">
            <stop stopColor="#F9F9F9" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <clipPath id="clip0_1_9080">
            <rect fill="white" height="30" width="30" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#d9d9d9] mt-8 md:mt-12 lg:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src='/img/logo.png'
              alt="Pustaka Setia"
              className="h-16 w-auto object-contain"
            />
            <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base leading-relaxed">
              Pustaka Setia merupakan penerbit buku yang menghadirkan karya-karya bermutu dari berbagai bidang
            </p>
          </div>

          {/* Kategori */}
          <div className="space-y-3">
            <h3 className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg md:text-xl">Kategori</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base hover:opacity-70 transition-opacity text-left">
                Tentang Kami
              </Link>
              <Link href="/products" className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base hover:opacity-70 transition-opacity text-left">
                Produk
              </Link>
              <Link href="/contact" className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base hover:opacity-70 transition-opacity text-left">
                Kontak Kami
              </Link>
            </nav>
          </div>

          {/* Office */}
          <div className="space-y-3">
            <h3 className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg md:text-xl">Kantor</h3>
            <div className="space-y-2">
              <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base">
                Pustaka Setia
              </p>
              <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base leading-relaxed">
                Jl. BKR No.162-164, Cigereleng, Kec. Regol, Kota Bandung, Jawa Barat 40253
              </p>
              <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-xs md:text-sm">
                pustakasetia@gmail.com
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-3">
            <h3 className="font-['Poppins',sans-serif] text-[#2f2f2f] text-lg md:text-xl">Bingung?</h3>
            <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base">
              Kirim pesan ke admin
            </p>
            <a
              href="https://api.whatsapp.com/send?phone=6282116109258"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-fit rounded-[7px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-white px-4 py-3">
                <span className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base whitespace-nowrap">
                  WhatsApp
                </span>
              </div>
              <div className="bg-[#60d669] px-3 py-3 flex items-center justify-center">
                <LogosWhatsappIcon />
              </div>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#2f2f2f] my-6 md:my-8" />

        {/* Copyright */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <TablerCopyright />
          <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-xs md:text-sm text-center">
            2025 PUSTAKA SETIA All right reserved
          </p>
        </div>
      </div>
    </footer>
  );
}