import { useState, useEffect } from 'react';
import { BookCard } from './ui';
import { Book, BookCategory } from '../types/book';
import { books } from '../data/books';
import Hero from './Hero';
import Footer from './Footer';

interface HomePageProps {
  onBookClick: (book: Book) => void;
  onNavigate: (page: string, category?: BookCategory) => void;
}

export default function HomePage({ onBookClick, onNavigate }: HomePageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [visibleBooks, setVisibleBooks] = useState(8); // Start with 8 books
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load more books (8 at a time) with animation
  const handleLoadMore = () => {
    setIsLoading(true);
    
    // Simulate loading delay for smooth animation
    setTimeout(() => {
      setVisibleBooks(prev => Math.min(prev + 8, books.length));
      setIsLoading(false);
      
      // Smooth scroll to new content
      setTimeout(() => {
        window.scrollBy({ top: 400, behavior: 'smooth' });
      }, 100);
    }, 300);
  };

  // Get books to display based on visibleBooks state
  const displayBooks = books.slice(0, visibleBooks);
  const hasMoreBooks = visibleBooks < books.length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero onExploreClick={() => window.scrollBy({ top: 600, behavior: 'smooth' })} />

      {/* All Books Grid - 4 columns desktop, 2 columns mobile */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
        {/* Section Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            Koleksi Buku
          </h2>
          <p className="text-sm md:text-base text-neutral-600 mt-2">
            Menampilkan {visibleBooks} dari {books.length} buku
          </p>
        </div>

        {/* Books Grid with Parallax Animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayBooks.map((book, index) => (
            <div
              key={book.id}
              className="animate-fadeInUp"
              style={{
                animationDelay: `${(index % 8) * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <BookCard
                book={book}
                onClick={() => onBookClick(book)}
                variant={isMobile ? 'mobile' : 'default'}
              />
            </div>
          ))}
        </div>

        {/* Load More Link */}
        {hasMoreBooks && (
          <div className="flex justify-center mt-8 md:mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="group relative text-lg md:text-xl font-medium text-neutral-900 hover:text-yellow-600 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative">
                {isLoading ? 'Loading...' : 'View More...'}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 group-hover:bg-yellow-600 transition-colors duration-300"></span>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
