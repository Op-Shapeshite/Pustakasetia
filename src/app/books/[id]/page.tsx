'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from "@/components/Header";
import BookDetailPage from "@/components/BookDetailPage";
import { books } from "@/data/books";

export default function BookDetail() {
    const params = useParams();
    const router = useRouter();
    const bookId = parseInt(params.id as string);

    const book = books.find(b => b.id === bookId);

    if (!book) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Buku tidak ditemukan</h1>
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
        image: book.image,
        title: book.title,
        author: book.author,
        price: typeof book.price === 'number' ? `Rp${book.price.toLocaleString('id-ID')}` : book.price,
        pages: book.pages,
        size: book.size,
        edition: book.edition,
        isbn: book.isbn,
        paperType: book.paperType,
        synopsis: book.synopsis
    };

    return (
        <>
            <Header />
            <BookDetailPage book={bookForDetail} onBack={() => router.back()} />
        </>
    );
}
