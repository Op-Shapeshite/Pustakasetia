import Footer from "./Footer";

const imgRectangle1304 = "/img/library-background.png";
const imgImage = "/img/book-cover-optimized.png";
const imgImage6 = "/img/book-cover-optimized.png";

export default function AboutPage() {
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
                Pustaka Setia merupakan penerbit buku yang menghadirkan karya-karya bermutu dari berbagai bidang, mulai dari agama, sastra, bahasa asing, cerita rakyat, hingga pembangunan politik. Dengan dedikasi pada kualitas dan ketelitian editorial, kami berupaya menyediakan literatur yang informatif, edukatif, dan relevan bagi pembaca dari berbagai kalangan. Melalui semangat "pustaka" sebagai sumber pengetahuan dan "setia" sebagai bentuk komitmen, Pustaka Setia terus berperan dalam memperkaya khazanah literasi dan mendukung pengembangan wawasan masyarakat.
              </p>
            </div>

            {/* Right Box */}
            <div className="bg-[#d9d9d9] rounded-[24px] h-[300px] md:h-[350px] lg:h-[426px] w-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Legal dan Tercatat */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
              <div className="flex-shrink-0 w-32 md:w-40 lg:w-[174px]">
                <img
                  src="/img/legality.png"
                  alt="Legal Document"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="font-['Poppins',sans-serif] text-[#2f2f2f] text-xl md:text-2xl">
                  Legal dan Tercatat
                </h3>
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg lg:text-xl leading-relaxed text-justify">
                  CV. Pustaka Setia tercatat dengan legal dan memiliki akte resmi di Notaris .................................................................................
                </p>
              </div>
            </div>

            {/* Kantor Pustaka Setia */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
              <div className="flex-shrink-0 w-32 md:w-40 lg:w-[163px]">
                <img
                  src="/img/office-location.png"
                  alt="Office Building"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="font-['Poppins',sans-serif] text-[#2f2f2f] text-xl md:text-2xl">
                  Kantor Pustaka Setia
                </h3>
                <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg lg:text-xl leading-relaxed text-justify">
                  CV. Pustaka Setia aktif berkantor di Jl. BKR No.162-164, Cigereleng, Kec. Regol, Kota Bandung, Jawa Barat 40253
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
