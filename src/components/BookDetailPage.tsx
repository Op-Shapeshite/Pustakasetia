import { ArrowLeft, ShoppingCart } from "lucide-react";
const imgRectangle1304 = "/img/library-background.png";
import { addToCart } from "../utils/cartStorage";

interface Book {
  id: number;
  image: string;
  title: string;
  author: string;
  price: string;
  pages?: number;
  size?: string;
  edition?: string;
  isbn?: string;
  paperType?: string;
  synopsis?: string;
}

interface BookDetailPageProps {
  book: Book;
  onBack: () => void;
}

export default function BookDetailPage({ book, onBack }: BookDetailPageProps) {
  const handleBuy = () => {
    const message = `Halo, saya ingin membeli buku "${book.title}" dengan harga ${book.price}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=6282116109258&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      image: book.image,
      title: book.title,
      author: book.author,
      price: book.price,
      isbn: book.isbn,
      edition: book.edition
    });

    alert(`"${book.title}" berhasil ditambahkan ke keranjang!`);
  };

  const SpecifictionItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex items-baseline text-[14px] sm:text-[16px] lg:text-[16px]">
      <div className="w-[140px] sm:w-[160px] lg:w-[180px] flex-shrink-0 font-medium text-[#2f2f2f]">
        {label}
      </div>
      <div className="mr-4 text-[#2f2f2f]">:</div>
      <div className="flex-1 text-[#2f2f2f]">
        {value}
      </div>
    </div>
  );

  return (
    <div className="bg-neutral-50 min-h-screen w-full font-['Poppins',sans-serif]">
      {/* Background Image Section - 374px height */}
      <div className="relative h-[200px] sm:h-[280px] md:h-[374px] w-full overflow-hidden">
        <img
          src={imgRectangle1304}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-[30px] left-[30px] sm:top-[50px] sm:left-[50px] w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] bg-white rounded-full hover:bg-gray-100 transition-colors z-20 flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#2f2f2f]" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 -mt-[100px] sm:-mt-[150px] md:-mt-[200px] relative z-10">
        <div className="max-w-[1400px] mx-auto">
          {/* Book Info Section - Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12">
            {/* Left Column - Book Cover */}
            <div className="flex justify-center lg:justify-start flex-shrink-0">
              <div className="w-[240px] sm:w-[286px] md:w-[318px]">
                <div className="aspect-[318/465] relative rounded-[12px] overflow-hidden shadow-[20px_20px_30px_0px_rgba(0,0,0,0.25)]">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Book Details */}
            <div className="flex flex-col justify-end pb-4 space-y-6 lg:space-y-8 flex-1">
              {/* Title and Author */}
              <div className="text-center lg:text-left lg:mt-[40px]">
                <h1 className="font-black text-[#2f2f2f] lg:text-white text-[28px] sm:text-[36px] md:text-[40px] lg:text-[48px] leading-tight mb-3">
                  {book.title}
                </h1>
                <p className="font-bold text-[#2f2f2f] lg:text-white text-[16px] sm:text-[18px] md:text-[20px] leading-normal">
                  {book.author}
                </p>
              </div>

              {/* Book Specifications List (No Table) */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-100 space-y-3">
                <SpecifictionItem label="Jumlah Halaman" value={`${book.pages || 198} halaman`} />
                <SpecifictionItem label="Ukuran Buku" value={book.size || "16 x 24 cm"} />
                <SpecifictionItem label="Edisi dan Cetakan" value={book.edition || "Ke-1. 2025"} />
                <SpecifictionItem label="ISBN" value={book.isbn || "978-979-076-799-1"} />
                <SpecifictionItem label="Jenis Kertas" value={book.paperType || "HVS"} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <button
                  onClick={handleBuy}
                  className="bg-green-500 text-white font-bold px-6 lg:px-8 py-3 lg:py-4 rounded-[6px] hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-[16px] sm:text-[18px] lg:text-[20px] leading-normal whitespace-nowrap"
                >
                  <span>BELI</span>
                  <span>{book.price}</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="bg-[#ffcc00] text-[#2f2f2f] font-medium px-6 lg:px-8 py-3 lg:py-4 rounded-[6px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-[16px] sm:text-[18px] lg:text-[20px] leading-normal whitespace-nowrap"
                >
                  <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 text-[#2f2f2f]" />
                  <span>Masukkan Keranjang</span>
                </button>
              </div>
            </div>
          </div>

          {/* Synopsis Section */}
          <div className="mt-12 lg:mt-16 xl:mt-20 pb-12">
            <h2 className="font-medium text-[#2f2f2f] text-[32px] sm:text-[40px] lg:text-[48px] leading-normal mb-6">
              Sinopsis
            </h2>
            <div className="text-[#2f2f2f] text-[16px] sm:text-[18px] lg:text-[20px] leading-relaxed text-justify">
              {book.synopsis || (
                <p>
                  Gorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}