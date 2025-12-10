import { X, ShoppingCart, ArrowLeft } from "lucide-react";
// Image is hardcoded in the component
import { useAppState } from "../contexts/AppStateContext";
import { usePopup } from "../contexts/PopupContext";
import { Book } from "../types/book";

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  onAddToCart?: () => void;
}

export default function BookDetailModal({ book, onClose, onAddToCart }: BookDetailModalProps) {
  const { addToCart } = useAppState();
  const { showPopup } = usePopup();

  const handleBuy = () => {
    // Navigate to WhatsApp after popup closes
    const doRedirect = () => {
      // Use formatted price from book object or format it
      const formattedPrice = book.priceFormatted || `Rp${book.price.toLocaleString('id-ID')}`;

      // Open WhatsApp with book details
      const message = `Halo, saya ingin membeli buku "${book.title}" dengan harga ${formattedPrice}`;
      const whatsappUrl = `https://api.whatsapp.com/send?phone=6282116109258&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    };

    // Show redirect message with callback
    showPopup("Mengarahkan ke WhatsApp...", "info", doRedirect);
  };

  const getDisplayPrice = () => {
    return book.priceFormatted || `Rp${book.price.toLocaleString('id-ID')}`;
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
    showPopup(`"${book.title}" berhasil ditambahkan ke keranjang!`, "success");

    // Call the optional callback
    if (onAddToCart) {
      onAddToCart();
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-neutral-50 rounded-[24px] shadow-2xl my-8 overflow-hidden min-h-[600px]">

        {/* Header Section (Background + Title Overlay) */}
        <div className="relative h-[280px] w-full">
          {/* Background Image */}
          <div className="absolute inset-0 top-0">
            <img
              src="/img/library-background.png"
              alt="Background"
              className="w-full h-full object-cover brightness-[0.4]"
            />
          </div>

          {/* Back Button (ArrowLeft) */}
          <button
            onClick={onClose}
            className="absolute top-6 left-6 z-50 text-white hover:opacity-80 transition-opacity"
            aria-label="Back"
          >
            <ArrowLeft className="h-8 w-8" />
          </button>

          {/* Title & Author (Positioned to the right of the book cover placeholder) */}
          {/* We use padding-left to push text to the right, assuming book cover is on the left */}
          <div className="hidden md:block absolute bottom-0 left-1/2 -translate-y-1/2 left-4 right-4 md:left-[340px] md:right-12 z-10 text-white">
            <h1 className="font-['Poppins',sans-serif] font-bold text-2xl md:text-3xl lg:text-[40px] leading-tight mb-3 drop-shadow-md">
              {book.title}
            </h1>
            <p className="font-['Poppins',sans-serif] text-sm md:text-base lg:text-lg font-light opacity-95 drop-shadow-md">
              {book.author}
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 pb-8 md:px-10 md:pb-12">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

            {/* Left Column: Floating Book Cover */}
            <div className="flex-shrink-0 mx-auto md:mx-0 -mt-32 md:-mt-28 z-20 w-[200px] md:w-[240px] lg:w-[260px]">
              <div className="aspect-[2/3] rounded-[12px] overflow-hidden shadow-2xl border-4 border-white/10">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Mobile Title & Author (Visible only on mobile, below image) */}
              <div className="block md:hidden mt-6 text-center">
                <h1 className="font-['Poppins',sans-serif] font-bold text-2xl text-[#2f2f2f] leading-tight mb-2">
                  {book.title}
                </h1>
                <p className="font-['Poppins',sans-serif] text-base text-gray-600 font-medium">
                  {book.author}
                </p>
              </div>
            </div>

            {/* Right Column: Details, Actions, Synopsis */}
            <div className="flex-1 pt-4 md:pt-6 space-y-8">

              {/* Book Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 font-['Poppins',sans-serif] text-[15px]">
                <div className="flex items-start">
                  <span className="text-gray-500 w-[140px] flex-shrink-0">Jumlah Halaman</span>
                  <span className="text-[#2f2f2f] font-medium">: {book.pages || 198}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-[140px] flex-shrink-0">Jenis Kertas</span>
                  <span className="text-[#2f2f2f] font-medium">: {book.paperType || "HVS"}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-[140px] flex-shrink-0">Ukuran Buku</span>
                  <span className="text-[#2f2f2f] font-medium">: {book.size || "16 x 24 cm"}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-[140px] flex-shrink-0">ISBN</span>
                  <span className="text-[#2f2f2f] font-medium">: {book.isbn || "978-979-076-799-1"}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 w-[140px] flex-shrink-0">Edisi dan Cetakan</span>
                  <span className="text-[#2f2f2f] font-medium">: {book.edition || "Ke-1. 2025"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBuy}
                  className="bg-[#22C55E] hover:bg-[#1ea850] text-white font-['Poppins',sans-serif] font-bold text-lg px-8 py-3 rounded-[8px] transition-colors shadow-lg hover:shadow-xl uppercase min-w-[200px]"
                >
                  BELI {getDisplayPrice()}
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-[#ffcc00] hover:bg-[#ffdb4d] text-neutral-900 font-['Poppins',sans-serif] font-medium text-lg px-8 py-3 rounded-[8px] transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-w-[240px]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Masukkan Keranjang
                </button>
              </div>

              {/* Synopsis */}
              <div className="pt-2">
                <h2 className="font-['Poppins',sans-serif] font-bold text-[#2f2f2f] text-2xl mb-3">
                  Sinopsis
                </h2>
                {book.synopsis ? (
                  <div
                    className="font-['Poppins',sans-serif] text-gray-600 text-base leading-relaxed text-justify prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: book.synopsis }}
                  />
                ) : (
                  <div className="font-['Poppins',sans-serif] text-gray-600 text-base leading-relaxed text-justify">
                    <p className="mb-4">
                      Gorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar.
                    </p>
                    <p>
                      Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}