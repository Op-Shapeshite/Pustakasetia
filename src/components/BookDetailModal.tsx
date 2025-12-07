import { X, ShoppingCart, ArrowLeft } from "lucide-react";
// Image is hardcoded in the component
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

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  onAddToCart?: () => void;
}

export default function BookDetailModal({ book, onClose, onAddToCart }: BookDetailModalProps) {
  const handleBuy = () => {
    // Open WhatsApp with book details
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

    // Show success message
    alert(`"${book.title}" berhasil ditambahkan ke keranjang!`);

    // Call the optional callback
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-neutral-50 rounded-[24px] shadow-2xl my-8">
        {/* Header with Background Image */}
        <div className="relative h-48 md:h-64 lg:h-80 rounded-t-[24px] overflow-hidden">
          <img
            src="/img/library-background.png"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 md:h-6 md:w-6 text-[#2f2f2f]" />
          </button>

          {/* Book Title and Author on Header */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 text-white">
            <h1 className="font-['Poppins',sans-serif] text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-2 line-clamp-2">
              {book.title}
            </h1>
            <p className="font-['Poppins',sans-serif] text-sm md:text-base lg:text-lg opacity-90 line-clamp-1">
              {book.author}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6 lg:gap-8">
            {/* Left Column - Book Cover and Actions */}
            <div className="space-y-6">
              {/* Book Cover */}
              <div className="w-full max-w-[300px] mx-auto lg:mx-0">
                <div className="aspect-[286/417] relative rounded-[12px] overflow-hidden shadow-[20px_20px_30px_0px_rgba(0,0,0,0.25)]">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBuy}
                  className="w-full bg-green-500 text-white font-['Poppins',sans-serif] px-6 py-4 rounded-[6px] hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="text-lg md:text-xl">BELI</span>
                  <span className="text-lg md:text-xl">{book.price}</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#ffcc00] text-[#2f2f2f] font-['Poppins',sans-serif] px-6 py-4 rounded-[6px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-lg md:text-xl">Masukkan Keranjang</span>
                </button>
              </div>
            </div>

            {/* Right Column - Details and Synopsis */}
            <div className="space-y-6">
              {/* Book Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg mb-1">
                    Jumlah Halaman
                  </p>
                  <p className="font-['Poppins',sans-serif] text-gray-500 text-base md:text-lg">
                    : {book.pages || 198}
                  </p>
                </div>

                <div>
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg mb-1">
                    Ukuran Buku
                  </p>
                  <p className="font-['Poppins',sans-serif] text-gray-500 text-base md:text-lg">
                    : {book.size || "16 x 24 cm"}
                  </p>
                </div>

                <div>
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg mb-1">
                    Edisi dan Cetakan
                  </p>
                  <p className="font-['Poppins',sans-serif] text-gray-500 text-base md:text-lg">
                    : {book.edition || "Ke-1. 2025"}
                  </p>
                </div>

                <div>
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg mb-1">
                    ISBN
                  </p>
                  <p className="font-['Poppins',sans-serif] text-gray-500 text-base md:text-lg">
                    : {book.isbn || "978-979-076-799-1"}
                  </p>
                </div>

                <div>
                  <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg mb-1">
                    Jenis Kertas
                  </p>
                  <p className="font-['Poppins',sans-serif] text-gray-500 text-base md:text-lg">
                    : {book.paperType || "HVS"}
                  </p>
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h2 className="font-['Poppins',sans-serif] text-[#2f2f2f] text-2xl md:text-3xl lg:text-4xl mb-4">
                  Sinopsis
                </h2>
                <div className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg leading-relaxed text-justify">
                  {book.synopsis || (
                    <>
                      <p className="mb-4">
                        Gorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                      </p>
                      <p>
                        Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}