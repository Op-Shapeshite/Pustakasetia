import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import imgWhatsAppImage20251127At53719Pm1 from "figma:asset/9820bb74109b82eae5e859e0502f9a825ad017da.png";
import imgWhatsAppImage20251127At53719Pm2 from "figma:asset/66136fdb2c447ca385752d440088596b8e740b35.png";
import imgWhatsAppImage20251127At53720Pm from "figma:asset/41b04e0368c52e1badd820f272f335a6c921e09b.png";
import imgWhatsAppImage20251127At53719Pm from "figma:asset/e2816cb4305509763ea631007eee44ecdd35441a.png";
import imgWhatsAppImage20251127At53720Pm2 from "figma:asset/c6a1e32300a872f41a1bc9bb645403444b6884c7.png";
import imgWhatsAppImage20251127At53721Pm from "figma:asset/47a129306e65f371f2d18645e7588dc532b671d8.png";
import imgWhatsAppImage20251127At53720Pm1 from "figma:asset/e139883d294c2d8c85f710519d588ed9ed48a272.png";
import imgWhatsAppImage20251127At53722Pm1 from "figma:asset/95771006c07a7a77bd105b80c1522ae8499820f2.png";
import BookDetailModal from "./BookDetailModal";

interface Book {
  id: number;
  image: string;
  title: string;
  author: string;
  price: string;
}

const allBooks: Book[] = [
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
  },
  // Duplicate books for pagination demo (page 2)
  {
    id: 9,
    image: imgWhatsAppImage20251127At53719Pm1,
    title: "Sistem Informasi Manajemen Pendidikan",
    author: "Dr. Dadang Suhairi, S.E., M.M & Dr. Cecep Wahyu Hoerudin, M.Pd.",
    price: "Rp42.000"
  },
  {
    id: 10,
    image: imgWhatsAppImage20251127At53719Pm,
    title: "Komunikasi Organisasi",
    author: "Dr. H. Yana Sutiana, M.Ag.",
    price: "Rp68.000"
  },
  {
    id: 11,
    image: imgWhatsAppImage20251127At53719Pm2,
    title: "Hukum Perkawinan Islam dan Isu-Isu Kontemporer Hukum Keluarga",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp78.000"
  },
  {
    id: 12,
    image: imgWhatsAppImage20251127At53720Pm,
    title: "Metode Penelitian Hukum Pendekatan Yuridis Normatif",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp68.000"
  },
  // Page 3
  {
    id: 13,
    image: imgWhatsAppImage20251127At53720Pm2,
    title: "Ilmu Sosial Dasar",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp48.000"
  },
  {
    id: 14,
    image: imgWhatsAppImage20251127At53721Pm,
    title: "Fiqih Muamalah Klasik dan Kontemporer",
    author: "Prof. Dr. H. Koko Komaruddin, M.Pd.",
    price: "Rp70.000"
  },
  {
    id: 15,
    image: imgWhatsAppImage20251127At53720Pm1,
    title: "Sosiologi Ekonomi Memaksimalkan Keuntungan dan Meminimalkan Risiko",
    author: "Dr. Dedah Jubaedah, M.Si.",
    price: "Rp53.000"
  },
  {
    id: 16,
    image: imgWhatsAppImage20251127At53722Pm1,
    title: "EYD Pedoman Umum Ejaan Bahasa Indonesia Yang Disempurnakan",
    author: "Pustaka Setia",
    price: "Rp25.000"
  }
];

const ITEMS_PER_PAGE = 8;

function BookCard({ book, onClick }: { book: Book; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col gap-3 group text-left w-full">
      <div className="aspect-[286/417] relative rounded-[12px] overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
        <img 
          src={book.image} 
          alt={book.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-2">
        <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-base md:text-lg lg:text-xl line-clamp-2 min-h-[3em]">
          {book.title}
        </p>
        <p className="font-['Poppins',sans-serif] text-gray-500 text-sm md:text-base line-clamp-1">
          {book.author}
        </p>
        <p className="font-['Poppins',sans-serif] text-green-500 text-lg md:text-xl">
          {book.price}
        </p>
      </div>
    </button>
  );
}

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const totalPages = Math.ceil(allBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBooks = allBooks.slice(startIndex, endIndex);

  return (
    <div className="w-full py-6 md:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Category Filter and Book Count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          {/* Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="bg-[#ffcc00] rounded-[6px] px-5 py-3 md:px-6 md:py-3 flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span className="font-['Poppins',sans-serif] text-black text-lg md:text-xl">
                Kategori
              </span>
              <ChevronDown className={`h-5 w-5 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {categoryOpen && (
              <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-10">
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 font-['Poppins',sans-serif] text-[#2f2f2f]">
                  Semua Kategori
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 font-['Poppins',sans-serif] text-[#2f2f2f]">
                  Pendidikan
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 font-['Poppins',sans-serif] text-[#2f2f2f]">
                  Hukum
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-gray-100 font-['Poppins',sans-serif] text-[#2f2f2f]">
                  Agama
                </button>
              </div>
            )}
          </div>

          {/* Book Count */}
          <p className="font-['Poppins',sans-serif] text-[#2f2f2f] text-sm md:text-base">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, allBooks.length)} dari <span className="font-semibold">{allBooks.length}</span> buku
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12">
          {currentBooks.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded font-['Poppins',sans-serif] transition-colors ${
                currentPage === page
                  ? 'bg-[#ffcc00] text-black'
                  : 'bg-white border border-gray-300 text-[#2f2f2f] hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}