'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookCard } from './ui';
import { Book } from '../types/book';
import Hero from './Hero';
import Footer from './Footer';
import { Loader2 } from 'lucide-react';
import BookDetailModal from './BookDetailModal';

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

export default function HomePage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
    // Force recompile trigger - updated formatting
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleBooks, setVisibleBooks] = useState(8);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const fetchBooks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/books?limit=100');
            if (!response.ok) throw new Error('Failed to fetch books');
            const data = await response.json();
            setBooks(data.data.map(mapAPIBookToBook));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load books');
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

    const handleLoadMore = () => {
        setIsLoadingMore(true);

        setTimeout(() => {
            setVisibleBooks(prev => Math.min(prev + 8, books.length));
            setIsLoadingMore(false);

            setTimeout(() => {
                window.scrollBy({ top: 400, behavior: 'smooth' });
            }, 100);
        }, 300);
    };

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
    };

    const handleCloseModal = () => {
        setSelectedBook(null);
    };

    const displayBooks = books.slice(0, visibleBooks);
    const hasMoreBooks = visibleBooks < books.length;

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                <span className="ml-2 text-gray-500">Memuat buku...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <Hero onExploreClick={() => window.scrollBy({ top: 600, behavior: 'smooth' })} />

            {/* All Books Grid */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
                {/* Section Header */}
                <div className="mb-6 md:mb-8 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                        Koleksi Buku
                    </h2>
                    <p className="text-sm md:text-base text-neutral-600 mt-2">
                        Menampilkan {Math.min(visibleBooks, books.length)} dari {books.length} buku
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                        <button onClick={fetchBooks} className="ml-2 underline">Coba lagi</button>
                    </div>
                )}

                {/* Books Grid */}
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
                                onClick={() => handleBookClick(book)}
                                variant={isMobile ? 'mobile' : 'default'}
                            />
                        </div>
                    ))}
                </div>

                {books.length === 0 && !error && (
                    <div className="text-center py-16">
                        <p className="text-xl text-neutral-600">Belum ada buku tersedia</p>
                    </div>
                )}

                {/* Load More */}
                {hasMoreBooks && (
                    <div className="flex justify-center mt-8 md:mt-12">
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="group relative text-lg md:text-xl font-medium text-neutral-900 hover:text-yellow-600 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative">
                                {isLoadingMore ? 'Loading...' : 'View More...'}
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 group-hover:bg-yellow-600 transition-colors duration-300"></span>
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <Footer />

            {/* Book Detail Modal */}
            {selectedBook && (
                <BookDetailModal
                    book={selectedBook}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
