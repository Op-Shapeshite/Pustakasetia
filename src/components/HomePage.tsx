'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookCard, HomePageSkeleton } from './ui';
import { Book } from '../types/book';
import Hero from './Hero';
import Footer from './Footer';
import BookDetailModal from './BookDetailModal';
import { mapAPIBookToBook } from '@/utils/bookMapper';

interface HomePageProps {
    initialBooks?: Book[];
}

export default function HomePage({ initialBooks = [] }: HomePageProps) {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [books, setBooks] = useState<Book[]>(initialBooks);
    // Force recompile trigger - updated formatting
    const [loading, setLoading] = useState(initialBooks.length === 0);
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
        if (initialBooks.length === 0) {
            fetchBooks();
        } else {
            setLoading(false);
        }
    }, [fetchBooks, initialBooks.length]);

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
        return <HomePageSkeleton />;
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            {/* Hero Section */}
            <Hero />

            {/* All Books Grid */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16  md:py-12">
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
                            onClick={() => router.push('/products')}
                            className="group relative text-lg md:text-xl font-medium text-neutral-900 hover:text-yellow-600 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative">
                                View More...
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
