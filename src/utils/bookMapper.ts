
import { Book } from "@/types/book";

// API Book type from database
export interface APIBook {
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
export function mapAPIBookToBook(apiBook: APIBook): Book {
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
