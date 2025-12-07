'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import BookDetailPage from "@/components/BookDetailPage";
import { Loader2 } from 'lucide-react';

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
}

export default function BookDetail() {
    const params = useParams();
    const router = useRouter();
    const bookId = params.id as string;

    const [book, setBook] = useState<APIBook | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBook() {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/books/${bookId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Buku tidak ditemukan');
                    } else {
                        throw new Error('Failed to fetch book');
                    }
                    return;
                }
                const data = await response.json();
                setBook(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load book');
            } finally {
                setLoading(false);
            }
        }

        if (bookId) {
            fetchBook();
        }
    }, [bookId]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                    <span className="ml-2 text-gray-500">Memuat detail buku...</span>
                </div>
            </>
        );
    }

    if (error || !book) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">{error || 'Buku tidak ditemukan'}</h1>
                        <button
                            onClick={() => router.push('/products')}
                            className="bg-yellow-400 px-6 py-2 rounded-lg hover:bg-yellow-500"
                        >
                            Kembali ke Produk
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // Convert the book data to match BookDetailPage's expected interface
    const bookForDetail = {
        id: book.id,
        image: book.image || '/img/book-cover-optimized.png',
        title: book.title,
        author: book.author,
        price: `Rp${book.price.toLocaleString('id-ID')}`,
        pages: book.pages,
        size: book.size,
        edition: book.edition,
        isbn: book.isbn,
        paperType: 'HVS',
        synopsis: book.synopsis || 'Tidak ada sinopsis tersedia.'
    };

    return (
        <>
            <Header />
            <BookDetailPage book={bookForDetail} onBack={() => router.back()} />
        </>
    );
}
