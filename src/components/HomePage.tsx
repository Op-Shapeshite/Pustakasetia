import { useState } from "react";
import svgPaths from "../imports/svg-lwpe2pqckf";
import imgPustakaSetiaTracing2 from "figma:asset/a236558e0f6a9a9f56ec11523f0449430ba96187.png";
import img210056973109789661 from "figma:asset/54108510d10b2729401ffa3ce32f1faab0dc973b.png";
import imgWhatsAppImage20251127At53719Pm1 from "figma:asset/9820bb74109b82eae5e859e0502f9a825ad017da.png";
import imgWhatsAppImage20251127At53719Pm2 from "figma:asset/66136fdb2c447ca385752d440088596b8e740b35.png";
import imgWhatsAppImage20251127At53720Pm from "figma:asset/41b04e0368c52e1badd820f272f335a6c921e09b.png";
import imgWhatsAppImage20251127At53719Pm from "figma:asset/e2816cb4305509763ea631007eee44ecdd35441a.png";
import imgWhatsAppImage20251127At53720Pm2 from "figma:asset/c6a1e32300a872f41a1bc9bb645403444b6884c7.png";
import imgWhatsAppImage20251127At53721Pm from "figma:asset/47a129306e65f371f2d18645e7588dc532b671d8.png";
import imgWhatsAppImage20251127At53720Pm1 from "figma:asset/e139883d294c2d8c85f710519d588ed9ed48a272.png";
import imgWhatsAppImage20251127At53722Pm1 from "figma:asset/95771006c07a7a77bd105b80c1522ae8499820f2.png";

interface Book {
  id: number;
  image: string;
  title: string;
  author: string;
  price: string;
}

interface HomePageProps {
  onBookClick: (book: Book) => void;
}

const books: Book[] = [
  {
    id: 1,
    image: imgWhatsAppImage20251127At53719Pm1,
    title: "Sistem Informasi Manajemen Pendidikan",
    author: "Dr. Dadang Suhairi, S.E., M.M & Dr. Cecep Wahyu Hoerudin, M.Pd.",
    price: "Rp42.000"
  },
  {
    id: 2,
    image: imgWhatsAppImage20251127At53719Pm,
    title: "Komunikasi Organisasi",
    author: "Dr. H. Yana Sutiana, M.Ag.",
    price: "Rp68.000"
  },
  {
    id: 3,
    image: imgWhatsAppImage20251127At53719Pm2,
    title: "Hukum Perkawinan Islam dan Isu-Isu Kontemporer Hukum Keluarga",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp78.000"
  },
  {
    id: 4,
    image: imgWhatsAppImage20251127At53720Pm,
    title: "Metode Penelitian Hukum Pendekatan Yuridis Normatif",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp68.000"
  },
  {
    id: 5,
    image: imgWhatsAppImage20251127At53720Pm2,
    title: "Ilmu Sosial Dasar",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp48.000"
  },
  {
    id: 6,
    image: imgWhatsAppImage20251127At53721Pm,
    title: "Fiqih Muamalah Klasik dan Kontemporer",
    author: "Prof. Dr. H. Koko Komaruddin, M.Pd.",
    price: "Rp70.000"
  },
  {
    id: 7,
    image: imgWhatsAppImage20251127At53720Pm1,
    title: "Sosiologi Ekonomi Memaksimalkan Keuntungan dan Meminimalkan Risiko",
    author: "Dr. Dedah Jubaedah, M.Si.",
    price: "Rp53.000"
  },
  {
    id: 8,
    image: imgWhatsAppImage20251127At53722Pm1,
    title: "EYD Pedoman Umum Ejaan Bahasa Indonesia Yang Disempurnakan",
    author: "Pustaka Setia",
    price: "Rp25.000"
  }
];

function Ellipse() {
  return (
    <div className="relative size-[126.349px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 127 127">
        <g>
          <mask height="127" id="mask0_1_9085" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="127" x="0" y="0">
            <circle cx="63.1745" cy="63.1745" fill="#061354" r="63.1745" />
          </mask>
          <g mask="url(#mask0_1_9085)">
            <line stroke="white" strokeWidth="3" x1="-7.57677" x2="-7.57678" y1="-28.7501" y2="154.342" />
            <line stroke="white" strokeWidth="3" x1="4.52452" x2="4.52451" y1="-28.7468" y2="154.346" />
            <line stroke="white" strokeWidth="3" x1="16.6319" x2="16.6319" y1="-28.7487" y2="154.344" />
            <line stroke="white" strokeWidth="3" x1="28.7393" x2="28.7392" y1="-28.7506" y2="154.342" />
            <line stroke="white" strokeWidth="3" x1="40.8405" x2="40.8405" y1="-28.7472" y2="154.345" />
            <line stroke="white" strokeWidth="3" x1="52.9479" x2="52.9479" y1="-28.7492" y2="154.343" />
            <line stroke="white" strokeWidth="3" x1="65.0492" x2="65.0492" y1="-28.7458" y2="154.347" />
            <line stroke="white" strokeWidth="3" x1="77.1582" x2="77.1581" y1="-28.7466" y2="154.346" />
            <line stroke="white" strokeWidth="3" x1="89.2639" x2="89.2639" y1="-28.7496" y2="154.343" />
            <line stroke="white" strokeWidth="3" x1="101.367" x2="101.367" y1="-28.7452" y2="154.347" />
            <line stroke="white" strokeWidth="3" x1="113.473" x2="113.473" y1="-28.7482" y2="154.344" />
            <line stroke="white" strokeWidth="3" x1="124.203" x2="124.203" y1="-21.2106" y2="161.882" />
            <line stroke="white" strokeWidth="3" x1="136.929" x2="136.929" y1="-28.7499" y2="154.343" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export default function HomePage({ onBookClick }: HomePageProps) {
  return (
    <div className="bg-neutral-50 w-full">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 relative z-10">
              <h1 className="font-['Poppins',sans-serif] text-[#221f30] text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-tight">
                Jelajahi koleksi buku terbaik kami untuk Anda
              </h1>
              <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed">
                Pustaka Setia menghadirkan berbagai koleksi buku untuk memberikan ilmu yang mendalam dan bacaan bermakna. Temukan inspirasi baru melalui pilihan buku terbaik kami.
              </p>
              <button className="bg-[#ffcc00] text-[#2f2f2f] font-['Poppins',sans-serif] text-[16px] md:text-[18px] px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
                Jelajahi Sekarang
              </button>
            </div>

            {/* Right Image with Decorative Elements */}
            <div className="relative">
              {/* Decorative Background Elements */}
              <div className="absolute -right-10 -top-10 w-full h-full pointer-events-none hidden lg:block">
                <div className="absolute top-[50px] right-[150px] rotate-[23.846deg] scale-y-[-1]">
                  <svg className="w-[300px] h-auto" fill="none" preserveAspectRatio="none" viewBox="0 0 692 612">
                    <path d={svgPaths.p18f428c0} stroke="#BAEF02" strokeLinecap="round" strokeWidth="250" />
                  </svg>
                </div>
                <div className="absolute top-[100px] right-[100px] rotate-[312.459deg] scale-y-[-1]">
                  <svg className="w-[250px] h-auto" fill="none" preserveAspectRatio="none" viewBox="0 0 842 430">
                    <path d={svgPaths.p29353a80} stroke="#4039E8" strokeLinecap="round" strokeWidth="250" />
                  </svg>
                </div>
                <div className="absolute top-[200px] right-[200px] rotate-[324.914deg]">
                  <Ellipse />
                </div>
              </div>

              {/* Book Stack Image */}
              <div className="relative w-full max-w-[600px] mx-auto">
                <div className="aspect-[743/652] w-full shadow-[4px_7px_50px_0px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
                  <img 
                    src={img210056973109789661} 
                    alt="Books showcase" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-[#d9d9d9] py-8 md:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-[16px] md:text-[18px] mb-2">
                Total Kategori
              </p>
              <p className="font-['Poppins',sans-serif] font-bold text-[#2f2f2f] text-[32px] md:text-[40px]">
                20+
              </p>
            </div>
            <div>
              <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-[16px] md:text-[18px] mb-2">
                Total Buku Tersedia
              </p>
              <p className="font-['Poppins',sans-serif] font-bold text-[#2f2f2f] text-[32px] md:text-[40px]">
                500+
              </p>
            </div>
            <div>
              <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-[16px] md:text-[18px] mb-2">
                Total Buku yang Terjual
              </p>
              <p className="font-['Poppins',sans-serif] font-bold text-[#2f2f2f] text-[32px] md:text-[40px]">
                10K+
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Books Showcase Section */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {books.map((book) => (
              <button
                key={book.id}
                onClick={() => onBookClick(book)}
                className="flex flex-col gap-4 group text-left w-full"
              >
                {/* Book Cover */}
                <div className="w-full aspect-[286/417] relative rounded-[12px] overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Info */}
                <div className="space-y-2">
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-[18px] md:text-[20px] leading-normal line-clamp-2 min-h-[48px]">
                    {book.title}
                  </p>
                  <p className="font-['Poppins',sans-serif] text-gray-500 text-[14px] md:text-[16px] leading-normal line-clamp-1">
                    {book.author}
                  </p>
                  <p className="font-['Poppins',sans-serif] font-bold text-green-500 text-[18px] md:text-[20px] leading-normal">
                    {book.price}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* View More Link */}
          <div className="flex justify-center mt-12">
            <button className="font-['Poppins',sans-serif] text-black text-[18px] md:text-[20px] underline hover:opacity-70 transition-opacity">
              View More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
