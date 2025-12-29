'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { BookCard, PaginationControls } from '@/components/ui';
import BookDetailModal from '@/components/BookDetailModal';
import { Book } from '@/types/book';
import Footer from '@/components/Footer';

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

export default function CategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categorySlug = decodeURIComponent(params.slug as string);

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 8;

    const fetchBooks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // First, get all categories to find the matching category ID
            const categoriesRes = await fetch('/api/categories?limit=50');
            if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
            const categoriesData = await categoriesRes.json();

            // Find category by name (case-insensitive comparison)
            const matchedCategory = categoriesData.data.find(
                (cat: { id: number; name: string }) =>
                    cat.name.toLowerCase().trim() === categorySlug.toLowerCase().trim()
            );

            if (!matchedCategory) {
                setBooks([]);
                setLoading(false);
                return;
            }

            // Fetch books by category ID with pagination
            const params = new URLSearchParams();
            params.set('categoryId', matchedCategory.id.toString());
            params.set('page', currentPage.toString());
            params.set('limit', itemsPerPage.toString());

            const res = await fetch(`/api/books?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch books');

            const data = await res.json();
            setBooks(data.data.map(mapAPIBookToBook));

            if (data.pagination) {
                setTotalItems(data.pagination.total);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [categorySlug, currentPage, itemsPerPage]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const displayBooks = books;

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
    };

    const handleCloseModal = () => {
        setSelectedBook(null);
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
            {/* Header with Back Button */}
            <div className="sticky top-0 z-20 bg-white border-b border-neutral-100 px-4 py-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#2f2f2f]" />
                    </button>
                    <h1 className="font-['Poppins',sans-serif] font-semibold text-lg text-[#2f2f2f]">
                        {categorySlug}
                    </h1>
                </div>
            </div>

            {/* Books Grid */}
            <div className="px-4 py-6">
                {books.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {displayBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    onClick={() => handleBookClick(book)}
                                    variant="mobile"
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
                                    variant="mobile"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-neutral-600 mb-2 font-['Poppins',sans-serif]">
                            Tidak ada buku ditemukan
                        </p>
                        <p className="text-neutral-500 font-['Poppins',sans-serif]">
                            Belum ada buku dalam kategori ini
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
