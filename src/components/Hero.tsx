interface HeroProps {
  onExploreClick?: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-white overflow-hidden">
        <div className="relative max-w-[1440px] mx-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-6 md:space-y-8 px-4 md:px-8 lg:px-16 py-12 md:py-16 lg:py-20 lg:w-1/2 z-10">
              {/* Heading */}
              <h1 className="font-['Poppins',sans-serif] font-semibold text-4xl md:text-5xl lg:text-[64px] leading-[1.15] text-[#221f30]">
                Jelajahi koleksi buku terbaik kami untuk Anda
              </h1>

              {/* Description */}
              <p className="font-['Poppins',sans-serif] text-base md:text-lg lg:text-[20px] text-[#2f2f2f] leading-relaxed">
                Pustaka Setia menghadirkan berbagai koleksi buku untuk memberikan ilmu yang mendalam dan bacaan bermakna. Temukan inspirasi baru melalui pilihan buku terbaik kami.
              </p>

              {/* CTA Button */}
              <button
                onClick={onExploreClick}
                className="font-['Poppins',sans-serif] font-semibold bg-[#ffcc00] hover:bg-[#f0c000] text-[#2f2f2f] text-lg md:text-[20px] px-10 py-4 rounded-full w-fit transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Jelajahi Sekarang
              </button>
            </div>

            {/* Right Hero Image - Mentok kanan dan nempel bawah */}
            <div className="relative lg:w-1/2 overflow-hidden h-[400px] lg:h-[700px] lg:pr-0 flex items-end justify-end">
              <img
                src="/img/hand-hero-section.png"
                alt="Koleksi Buku Pustaka Setia"
                className="w-full lg:w-auto lg:h-[700px] object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#d9d9d9] pb-8 md:py-12">
        <div className="max-w-[1440px] mx-auto px-16 md:px-8 lg:px-16">
          <div className="flex justify-between  gap-4 md:gap-8 text-center">
            <div>
              <p className="font-['Poppins',sans-serif] text-2xl md:text-3xl lg:text-4xl font-bold text-[#2f2f2f]">8+</p>
              <p className="font-['Poppins',sans-serif] text-xs md:text-sm lg:text-[14px] text-black mt-2">Total Kategori</p>
            </div>
            <div>
              <p className="font-['Poppins',sans-serif] text-2xl md:text-3xl lg:text-4xl font-bold text-[#2f2f2f]">520+</p>
              <p className="font-['Poppins',sans-serif] text-xs md:text-sm lg:text-[14px] text-black mt-2">Total buku available</p>
            </div>
            <div>
              <p className="font-['Poppins',sans-serif] text-2xl md:text-3xl lg:text-4xl font-bold text-[#2f2f2f]">10,000+</p>
              <p className="font-['Poppins',sans-serif] text-xs md:text-sm lg:text-[14px] text-black mt-2">Total buku yang terjual</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
