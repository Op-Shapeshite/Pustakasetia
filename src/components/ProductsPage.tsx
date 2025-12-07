import { useState, useEffect } from 'react';
import { 
  BookCard, 
  CategoryFilter, 
  SearchBar, 
  PaginationControls 
} from './ui';
import { Book, BookCategory } from '../types/book';
import { getPaginatedBooks, searchBooks } from '../data/books';
import Footer from './Footer';

interface ProductsPageProps {
  onBookClick: (book: Book) => void;
  onNavigate: (page: string) => void;
  initialCategory?: BookCategory | 'all';
}

export default function ProductsPage({ 
  onBookClick, 
  onNavigate,
  initialCategory = 'all' 
}: ProductsPageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Get books based on search or category filter
  const getFilteredBooks = () => {
    if (searchQuery.trim()) {
      // Search across all books, then apply category filter if set
      let results = searchBooks(searchQuery);

      if (selectedCategory !== 'all') {
        results = results.filter((b) => b.category === selectedCategory);
      }

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      return {
        books: results.slice(startIndex, endIndex),
        totalPages: Math.ceil(results.length / itemsPerPage),
        totalItems: results.length
      };
    }
    
    return getPaginatedBooks(selectedCategory, currentPage, itemsPerPage);
  };

  const { books, totalPages, totalItems } = getFilteredBooks();

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">
            Produk Buku
          </h1>
          <p className="text-base md:text-lg text-neutral-600">
            Temukan {totalItems} buku berkualitas dari berbagai kategori
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Category Filter */}
          <div className="w-full md:w-auto">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              variant={isMobile ? 'mobile' : 'default'}
            />
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
              Menampilkan {books.length} hasil untuk "{searchQuery}" 
              {selectedCategory !== 'all' && ` di kategori ${selectedCategory}`}
            </p>
          ) : (
            <p>
              Menampilkan {books.length} dari {totalItems} buku
              {selectedCategory !== 'all' && ` di kategori ${selectedCategory}`}
            </p>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 pb-12">
        {books.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => onBookClick(book)}
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
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
