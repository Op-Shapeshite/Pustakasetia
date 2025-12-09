import { X, ShoppingCart, ArrowLeft } from "lucide-react";
// Image is hardcoded in the component
import { useAppState } from "../contexts/AppStateContext";
import { useToast } from "../contexts/ToastContext";
import { Book } from "../types/book";

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  onAddToCart?: () => void;
}

export default function BookDetailModal({ book, onClose, onAddToCart }: BookDetailModalProps) {
  const { addToCart } = useAppState();
  const { showToast } = useToast();

  const handleBuy = () => {
    // Use formatted price from book object or format it
    const formattedPrice = book.priceFormatted || `Rp${book.price.toLocaleString('id-ID')}`;

    // Open WhatsApp with book details
    const message = `Halo, saya ingin membeli buku "${book.title}" dengan harga ${formattedPrice}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=6282116109258&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getDisplayPrice = () => {
    return book.priceFormatted || `Rp ${book.price.toLocaleString('id-ID')}`;
  };

  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      image: book.image,
      title: book.title,
      price: book.price,
      author: book.author,
      isbn: book.isbn,
      edition: book.edition,
    });

    // Show success message
    showToast(`"${book.title}" berhasil ditambahkan ke keranjang!`, "success");

    // Call the optional callback
    if (onAddToCart) {
      onAddToCart();
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-neutral-50 rounded-[24px] shadow-2xl my-8 overflow-hidden">
        {/* Header with Background Image */}
        <div className="relative h-36 md:h-48 lg:h-64 w-full">
          <div className="absolute inset-0">
            <img
              src="/img/library-background.png"
              alt="Background"
              className="w-full h-full object-cover brightness-[0.4]"
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md border border-white/20 shadow-lg"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Book Title and Author on Header */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 text-white z-10">
            <h1 className="font-['Poppins',sans-serif] font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-2 line-clamp-2 drop-shadow-lg">
              {book.title}
            </h1>
            <p className="font-['Poppins',sans-serif] text-sm md:text-base lg:text-lg opacity-90 line-clamp-1 drop-shadow-md">
              {book.author}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8 lg:gap-12">
            {/* Left Column - Book Cover and Actions */}
            <div className="space-y-6">
              {/* Book Cover */}
              <div className="w-full max-w-[240px] md:max-w-[280px] mx-auto lg:mx-0">
                <div className="aspect-[2/3] relative rounded-[12px] overflow-hidden shadow-2xl transform lg:-translate-y-12 lg:mb-[-3rem] border-4 border-white">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 lg:pt-16">
                <button
                  onClick={handleBuy}
                  className="w-full bg-green-500 text-white font-['Poppins',sans-serif] font-semibold px-6 py-3 rounded-xl hover:bg-green-600 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/30"
                >
                  <span className="text-lg">BELI {getDisplayPrice()}</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#ffcc00] text-[#2f2f2f] font-['Poppins',sans-serif] font-semibold px-6 py-3 rounded-xl hover:bg-[#ffdb4d] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/20"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-lg">KRANJANG</span>
                </button>
              </div>
            </div>

            {/* Right Column - Details and Synopsis */}
            <div className="space-y-8">
              {/* Book Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-500 mb-1">Jumlah Halaman</span>
                  <span className="font-['Poppins',sans-serif] text-[#2f2f2f] font-medium text-lg">
                    {book.pages || 198} Halaman
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-neutral-500 mb-1">Ukuran Buku</span>
                  <span className="font-['Poppins',sans-serif] text-[#2f2f2f] font-medium text-lg">
                    {book.size || "16 x 24 cm"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-neutral-500 mb-1">Edisi dan Cetakan</span>
                  <span className="font-['Poppins',sans-serif] text-[#2f2f2f] font-medium text-lg">
                    {book.edition || "Ke-1. 2025"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-neutral-500 mb-1">ISBN</span>
                  <span className="font-['Poppins',sans-serif] text-[#2f2f2f] font-medium text-lg">
                    {book.isbn || "978-979-076-799-1"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-neutral-500 mb-1">Jenis Kertas</span>
                  <span className="font-['Poppins',sans-serif] text-[#2f2f2f] font-medium text-lg">
                    {book.paperType || "HVS"}
                  </span>
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