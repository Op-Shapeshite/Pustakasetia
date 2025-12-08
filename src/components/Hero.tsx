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
            <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-8 px-4 md:px-8 lg:px-16 pt-12 pb-2 md:py-16 lg:py-20 w-full lg:w-1/2 z-10 relative bg-white lg:bg-transparent">
              {/* Heading */}
              <h1 className="font-['Poppins',sans-serif] font-semibold text-3xl md:text-5xl lg:text-[64px] leading-[1.2] text-neutral-900">
                Jelajahi koleksi buku terbaik kami untuk Anda
              </h1>

              {/* Description */}
              <p className="font-['Poppins',sans-serif] text-sm md:text-lg lg:text-[20px] text-neutral-700 leading-relaxed max-w-lg lg:max-w-none">
                Pustaka Setia menghadirkan berbagai koleksi buku untuk memberikan ilmu yang mendalam dan bacaan bermakna. Temukan inspirasi baru melalui pilihan buku terbaik kami.
              </p>

              {/* CTA Button */}
              <button
                onClick={onExploreClick}
                className="font-['Poppins',sans-serif] font-semibold bg-[#ffcc00] hover:bg-[#f0c000] text-neutral-900 text-base md:text-[20px] px-8 py-3 md:px-10 md:py-4 rounded-full w-fit transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Jelajahi Sekarang
              </button>
            </div>

            {/* Right Hero Image */}
            <div className="relative w-full lg:w-1/2 overflow-hidden h-[400px] lg:h-[700px] lg:pr-0 flex items-end justify-center lg:justify-end pb-0">
              <img
                src="/img/hand-hero-section.png"
                alt="Koleksi Buku Pustaka Setia"
                className="w-full h-full lg:w-auto lg:h-[700px] object-contain object-bottom transform lg:translate-x-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* Stats Section */}
      <section className="w-full bg-neutral-100 py-10 md:py-16 border-t border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-row justify-between items-center text-center divide-x divide-neutral-300">
            <div className="flex-1 px-2 md:px-4">
              <p className="font-['Poppins',sans-serif] text-2xl md:text-4xl font-bold text-neutral-800">8+</p>
              <p className="font-['Poppins',sans-serif] text-[10px] md:text-sm font-medium text-neutral-600 mt-1 md:mt-2">Total Kategori</p>
            </div>
            <div className="flex-1 px-2 md:px-4">
              <p className="font-['Poppins',sans-serif] text-2xl md:text-4xl font-bold text-neutral-800">520+</p>
              <p className="font-['Poppins',sans-serif] text-[10px] md:text-sm font-medium text-neutral-600 mt-1 md:mt-2">Total buku available</p>
            </div>
            <div className="flex-1 px-2 md:px-4">
              <p className="font-['Poppins',sans-serif] text-2xl md:text-4xl font-bold text-neutral-800">10,000+</p>
              <p className="font-['Poppins',sans-serif] text-[10px] md:text-sm font-medium text-neutral-600 mt-1 md:mt-2">Total buku yang terjual</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
