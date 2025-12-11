import Header from "@/components/Header";
import HomePage from "@/components/HomePage";
import { mapAPIBookToBook } from "@/utils/bookMapper";

export const dynamic = 'force-dynamic';

async function getBooks() {
    try {
        // For server-side rendering, we need to use the full URL
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

        const url = `${baseUrl}/api/books?limit=8`;

        console.log('[Server] Fetching books from:', url);

        const res = await fetch(url, {
            next: { revalidate: 60 }, // Revalidate every 60 seconds
            cache: 'no-store' // Ensure fresh data during development
        });

        if (!res.ok) {
            console.error('[Server] Failed to fetch books, status:', res.status);
            return [];
        }

        const data = await res.json();
        console.log('[Server] Fetched books count:', data.data?.length || 0);
        return data.data.map(mapAPIBookToBook);
    } catch (error) {
        console.error('[Server] Failed to fetch books:', error);
        return [];
    }
}

export default async function Home() {
    const books = await getBooks();

    return (
        <>
            <Header />
            <HomePage initialBooks={books} />
        </>
    );
}
