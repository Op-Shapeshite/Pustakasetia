import { useState } from "react";

// Placeholder images - the BookShowcase component is not actively used
// The actual book images come from the books data file
const placeholderImage = "/img/book-cover-optimized.png";

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
    image: placeholderImage,
    title: "Sistem Informasi Manajemen Pendidikan",
    author: "Dr. Dadang Suhairi, S.E., M.M & Dr. Cecep Wahyu Hoerudin, M.Pd.",
    price: "Rp42.000"
  },
  {
    id: 2,
    image: placeholderImage,
    title: "Komunikasi Organisasi",
    author: "Dr. H. Yana Sutiana, M.Ag.",
    price: "Rp68.000"
  },
  {
    id: 3,
    image: placeholderImage,
    title: "Hukum Perkawinan Islam dan Isu-Isu Kontemporer Hukum Keluarga",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp78.000"
  },
  {
    id: 4,
    image: placeholderImage,
    title: "Metode Penelitian Hukum Pendekatan Yuridis Normatif",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp68.000"
  },
  {
    id: 5,
    image: placeholderImage,
    title: "Ilmu Sosial Dasar",
    author: "Dr. Beni Ahmad Saebani, M.Si.",
    price: "Rp48.000"
  },
  {
    id: 6,
    image: placeholderImage,
    title: "Fiqih Muamalah Klasik dan Kontemporer",
    author: "Prof. Dr. H. Koko Komaruddin, M.Pd.",
    price: "Rp70.000"
  },
  {
    id: 7,
    image: placeholderImage,
    title: "Sosiologi Ekonomi Memaksimalkan Keuntungan dan Meminimalkan Risiko",
    author: "Dr. Dedah Jubaedah, M.Si.",
    price: "Rp53.000"
  },
  {
    id: 8,
    image: placeholderImage,
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