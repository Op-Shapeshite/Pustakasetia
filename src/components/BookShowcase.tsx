import { useState } from "react";
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

export default function BookShowcase({ onBookClick }: { onBookClick: (book: Book) => void }) {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => onBookClick(book)} />
          ))}
        </div>

        <div className="flex justify-center mt-8 md:mt-12">
          <a 
            href="#more" 
            className="font-['Poppins',sans-serif] text-black text-lg md:text-xl underline hover:opacity-70 transition-opacity"
          >
            View More
          </a>
        </div>
      </div>
    </section>
  );
}