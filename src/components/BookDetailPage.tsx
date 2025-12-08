import { ArrowLeft, ShoppingCart } from "lucide-react";
import { addToCart } from "../utils/cartStorage";

const imgRectangle1304 = "/img/library-background.png";

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
  isModal?: boolean;
}

export default function BookDetailPage({ book, onBack, isModal = false }: BookDetailPageProps) {
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
    <div className="flex items-baseline text-[14px] sm:text-[16px]">
      <div className="w-[140px] sm:w-[150px] flex-shrink-0 font-medium text-[#2f2f2f]">
        {label}
      </div>
      <div className="mr-3 text-[#2f2f2f]">:</div>
      <div className="flex-1 text-[#2f2f2f] font-medium">
        {value}
      </div>
    </div>
  );

  return (
    <div className={`${isModal ? 'fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6' : 'min-h-screen w-full font-[\'Poppins\',sans-serif]'}`}>
      {isModal && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onBack} />}

      <div className={`${isModal ? 'relative w-full max-w-[1200px] h-[90vh] bg-neutral-50 rounded-2xl shadow-2xl overflow-y-auto animate-fadeInUp scrollbar-hide' : 'w-full'}`}>

        {/* Close/Back Button */}
        {/* Modal: Top Right of the card */}
        {isModal && (
          <button onClick={onBack} className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-md transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        {/* Page: Top Left fixed */}
        {!isModal && (
          <button onClick={onBack} className="fixed top-[30px] left-[30px] z-50 p-2 bg-white rounded-full shadow-lg hover:bg-neutral-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-[#2f2f2f]" />
          </button>
        )}

        {/* Content Wrapper */}
        <div className="relative w-full bg-neutral-50 min-h-full pb-12">

          {/* Header Background Image */}
          <div className="relative h-[300px] sm:h-[350px] w-full overflow-hidden">
            <img
              src={imgRectangle1304}
              className="w-full object-cover brightness-[0.4]"
              alt="Library Background"
            />
          </div>

          {/* Overlap Content Container */}
          <div className="w-full px-4 sm:px-8 lg:px-12 -mt-[180px] sm:-mt-[220px] relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

              {/* Left Column: Book Cover */}
              <div className="flex justify-center lg:justify-start flex-shrink-0">
                <div className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[260px] rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-auto object-cover  shadow-2xl aspect-[2/3]"
                  />
                </div>
              </div>

              {/* Right Column: Book Info */}
              <div className="flex flex-col flex-1 pt-4 lg:pt-16">

                {/* Title & Author (White on Dark BG) */}
                <div className="text-center lg:text-left mb-8 md:mb-10 text-white drop-shadow-lg">
                  <h1 className="font-bold text-[24px] sm:text-[32px] lg:text-[42px] leading-tight mb-2">
                    {book.title}
                  </h1>
                  <p className="font-medium text-[16px] sm:text-[18px] text-white/90">
                    {book.author}
                  </p>
                </div>

                {/* Specs & Buttons (Transition to White BG area) */}
                <div className="space-y-8 lg:mt-4">

                  {/* Specs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-12 text-[#2f2f2f]">
                    <SpecifictionItem label="Jumlah Halaman" value={`${book.pages || 198} halaman`} />
                    <SpecifictionItem label="Ukuran Buku" value={book.size || "16 x 24 cm"} />
                    <SpecifictionItem label="Edisi dan Cetakan" value={book.edition || "Ke-1. 2025"} />
                    <SpecifictionItem label="ISBN" value={book.isbn || "978-979-076-799-1"} />
                    <SpecifictionItem label="Jenis Kertas" value={book.paperType || "HVS"} />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                      onClick={handleBuy}
                      className="flex-1 bg-[#22c55e] text-white font-bold px-6 py-3.5 rounded-lg hover:bg-[#16a34a] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">BELI</span>
                      <span className="text-lg opacity-90">{book.price}</span>
                    </button>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#ffcc00] text-[#2f2f2f] font-bold px-6 py-3.5 rounded-lg hover:bg-[#e6b800] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5 text-[#2f2f2f]" />
                      <span className="text-lg">Masukkan Keranjang</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <h2 className="font-bold text-[#2f2f2f] text-[24px] mb-4">
                Sinopsis
              </h2>
              <div className="text-[#4a4a4a] text-[16px] leading-relaxed text-justify whitespace-pre-line">
                {book.synopsis || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}