import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from "@/components/Header";
import BookDetailPage from "@/components/BookDetailPage";
import { mapAPIBookToBook } from "@/utils/bookMapper";

interface Props {
    params: { id: string }
}

async function getBook(id: string) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/books/${id}`, {
            cache: 'no-store'
        });

        if (!res.ok) return null;

        const data = await res.json();
        return mapAPIBookToBook(data);
    } catch (e) {
        console.error('Failed to fetch book:', e);
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const book = await getBook(params.id);

    if (!book) {
        return {
            title: 'Buku Tidak Ditemukan',
        };
    }

    return {
        title: `${book.title} - Pustaka Setia`,
        description: book.synopsis?.slice(0, 160) || `Beli buku ${book.title} karya ${book.author} di Pustaka Setia.`,
        openGraph: {
            title: book.title,
            description: book.synopsis?.slice(0, 200),
            images: [book.image],
            type: 'book',
        },
    };
}

export default async function BookDetail({ params }: Props) {
    const book = await getBook(params.id);

    if (!book) {
        notFound();
    }

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: book.title,
        image: book.image ? (book.image.startsWith('http') ? book.image : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pustakasetia.id'}${book.image}`) : [],
        description: book.synopsis || `Buku ${book.title} karya ${book.author}`,
        sku: book.isbn,
        isbn: book.isbn,
        brand: {
            '@type': 'Brand',
            name: 'Pustaka Setia',
        },
        offers: {
            '@type': 'Offer',
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://pustakasetia.id'}/books/${book.id}`,
            priceCurrency: 'IDR',
            price: book.price,
            availability: book.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: 'https://schema.org/NewCondition',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <Header />
            <BookDetailPage book={book} />
        </>
    );
}
