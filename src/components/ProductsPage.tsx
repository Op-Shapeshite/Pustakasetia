'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookCard,
  SearchBar,
  PaginationControls
} from './ui';
import { Book, BookCategory } from '../types/book';
import Footer from './Footer';
import { Loader2 } from 'lucide-react';

// API Book type from database
interface APIBook {
  id: number;
  title: string;
  author: string;
  pages: number;
  size: string;
  isbn: string;
  price: number;
  edition: string;
  synopsis: string | null;
  image: string | null;
  stock: number;
  category: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
}

// Convert API book to frontend Book type
function mapAPIBookToBook(apiBook: APIBook): Book {
  return {
    id: apiBook.id,
    title: apiBook.title,
    author: apiBook.author,
    price: apiBook.price,
    priceFormatted: `Rp${apiBook.price.toLocaleString('id-ID')}`,
    image: apiBook.image || '/img/book-cover-optimized.png',
    pages: apiBook.pages,
    size: apiBook.size,
    edition: apiBook.edition,
    isbn: apiBook.isbn,
    paperType: 'HVS',
    synopsis: apiBook.synopsis || '',
    category: apiBook.category.name as Book['category'],
    tags: [],
    stock: apiBook.stock,
    bestseller: false,
    featured: false,
    publishYear: new Date(apiBook.createdAt).getFullYear(),
  };
}

interface ProductsPageProps {
  initialCategory?: BookCategory | 'all';
}

export default function ProductsPage({
  initialCategory = 'all'
}: ProductsPageProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch books and categories in parallel
      const [booksRes, categoriesRes] = await Promise.all([
        fetch('/api/books?limit=100'),
        fetch('/api/categories?limit=50')
      ]);

      if (!booksRes.ok) throw new Error('Failed to fetch books');
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories');

      const booksData = await booksRes.json();
      const categoriesData = await categoriesRes.json();

      setBooks(booksData.data.map(mapAPIBookToBook));
      setCategories(categoriesData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const getFilteredBooks = () => {
    let filtered = books;

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn.includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBooks = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { books: paginatedBooks, totalPages, totalItems };
  };

  const { books: displayBooks, totalPages, totalItems } = getFilteredBooks();

  const handleBookClick = (book: Book) => {
    router.push(`/books/${book.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        <span className="ml-2 text-gray-500">Memuat produk...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">
            Produk Buku
          </h1>
          <p className="text-base md:text-lg text-neutral-600">
            Temukan {books.length} buku berkualitas dari berbagai kategori
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-6 md:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
            <button onClick={fetchBooks} className="ml-2 underline">Coba lagi</button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Category Filter */}
          <div className="w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-[400px]">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Cari judul, penulis, atau ISBN..."
              variant={isMobile ? 'mobile' : 'default'}
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-6 text-sm text-neutral-600">
          {searchQuery ? (
            <p>
              Menampilkan {displayBooks.length} hasil untuk "{searchQuery}"
              {selectedCategory !== 'all' && ` di kategori ${selectedCategory}`}
            </p>
          ) : (
            <p>
              Menampilkan {displayBooks.length} dari {totalItems} buku
              {selectedCategory !== 'all' && ` di kategori ${selectedCategory}`}
            </p>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 pb-12">
        {displayBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {displayBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => handleBookClick(book)}
                  variant={isMobile ? 'mobile' : 'default'}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  variant={isMobile ? 'mobile' : 'default'}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-neutral-600 mb-2">
              Tidak ada buku ditemukan
            </p>
            <p className="text-neutral-500">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
