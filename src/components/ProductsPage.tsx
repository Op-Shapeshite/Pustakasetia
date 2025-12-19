'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookCard,
  SearchBar,
  PaginationControls,
  ProductsMobileSkeleton,
  ProductsDesktopSkeleton
} from './ui';
import BookDetailModal from './BookDetailModal';
import { Book, BookCategory } from '../types/book';
import Footer from './Footer';
import { ChevronDown } from 'lucide-react';

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

// Mobile Category Section Component
function MobileCategorySection({
  category,
  books,
  onBookClick,
}: {
  category: Category;
  books: Book[];
  onBookClick: (book: Book) => void;
}) {
  const router = useRouter();
  const displayBooks = books.slice(0, 5); // Max 5 cards

  if (displayBooks.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="font-['Poppins',sans-serif] font-semibold text-lg text-[#2f2f2f]">
          {category.name}
        </h2>
        <button
          onClick={() => router.push(`/products/category/${encodeURIComponent(category.name)}`)}
          className="text-[#5a4fcf] text-sm font-['Poppins',sans-serif] hover:underline"
        >
          Lihat Semua
        </button>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2" style={{ width: 'max-content' }}>
          {displayBooks.map((book) => (
            <div key={book.id} className="w-[140px] flex-shrink-0">
              <BookCard
                book={book}
                onClick={() => onBookClick(book)}
                variant="mobile"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const itemsPerPage = 16;
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories?limit=50');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('page', currentPage.toString());
      params.set('limit', itemsPerPage.toString());
      if (searchQuery) params.set('search', searchQuery);

      if (selectedCategory !== 'all') {
        // We need to find the category ID from the name since API expects ID
        // If categories aren't loaded yet, this might be an issue. 
        // Ideally we should store selectedCategoryID.
        // For now, let's try to find it from the categories state.
        const cat = categories.find(c => c.name === selectedCategory);
        if (cat) {
          params.set('categoryId', cat.id.toString());
        } else if (categories.length > 0) {
          // If categories are loaded but we can't find the name, maybe it's invalid?
          // Or maybe we should wait? 
          // For simplicity in this refactor, if we can't find ID, we don't send it (fetch all) or we could block.
          // However, to ensure smooth UX, let's assume if user selected a category, it exists in our list.
        }
      }

      const res = await fetch(`/api/books?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch books');

      const data = await res.json();
      setBooks(data.data.map(mapAPIBookToBook));

      // Update pagination info from API response
      if (data.pagination) {
        setTotalItems(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery, selectedCategory, categories]);

  // Initial load of categories
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch books when dependencies change
  useEffect(() => {
    // Only fetch books if categories are loaded OR if we don't need category ID (all)
    if (selectedCategory === 'all' || categories.length > 0) {
      fetchBooks();
    }
  }, [fetchBooks]); // fetchBooks depends on categories

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

  // Group books by category for mobile view (Client side grouping of the FETCHED page)
  const getBooksByCategory = useCallback(() => {
    const grouped: { [key: string]: Book[] } = {};
    books.forEach((book) => {
      const categoryName = book.category;
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(book);
    });
    return grouped;
  }, [books]);

  // We no longer slice locally, use full books array as displayBooks
  const displayBooks = books;
  const booksByCategory = getBooksByCategory();

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  if (loading) {
    return isMobile ? <ProductsMobileSkeleton /> : <ProductsDesktopSkeleton />;
  }

  // Mobile Layout - Category Grouped View
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1440px] mx-auto py-6">
          {/* Mobile Category Sections */}
          {categories.map((category) => (
            <MobileCategorySection
              key={category.id}
              category={category}
              books={booksByCategory[category.name] || []}
              onBookClick={handleBookClick}
            />
          ))}

          {categories.length === 0 && (
            <div className="text-center py-16 px-4">
              <p className="text-xl text-neutral-600 mb-2 font-['Poppins',sans-serif]">
                Tidak ada kategori ditemukan
              </p>
            </div>
          )}
        </div>

        {selectedBook && (
          <BookDetailModal
            book={selectedBook}
            onClose={handleCloseModal}
          />
        )}

        <Footer />
      </div>
    );
  }

  // Desktop Layout - Original Grid View
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">

        {/* Top Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">

          {/* Custom Kategori Dropdown */}
          <div className="relative z-10">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#ffcc00] hover:bg-[#ffd633] text-[#2f2f2f] px-6 py-3 rounded-lg font-['Poppins',sans-serif] font-medium transition-colors"
            >
              <span>{selectedCategory === 'all' ? 'Kategori' : selectedCategory}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-neutral-100 py-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 font-['Poppins',sans-serif] ${selectedCategory === 'all' ? 'text-[#ffcc00] font-medium' : 'text-[#2f2f2f]'
                    }`}
                >
                  Semua Kategori
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 font-['Poppins',sans-serif] ${selectedCategory === cat.name ? 'text-[#ffcc00] font-medium' : 'text-[#2f2f2f]'
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Count - Right Aligned */}

          <div className="text-sm text-neutral-600 font-['Poppins',sans-serif]">
            Menampilkan {displayBooks.length} dari {totalItems} Data
          </div>
        </div>

        {/* Books Grid - 4 Columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12">
          {displayBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => handleBookClick(book)}
              variant="default"
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              variant="default"
            />
          </div>
        )}

        {displayBooks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-neutral-600 mb-2 font-['Poppins',sans-serif]">
              Tidak ada buku ditemukan
            </p>
            <p className="text-neutral-500 font-['Poppins',sans-serif]">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        )}

        {selectedBook && (
          <BookDetailModal
            book={selectedBook}
            onClose={handleCloseModal}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

