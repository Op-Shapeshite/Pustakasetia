import Header from "@/components/Header";
import HomePage from "@/components/HomePage";
import { mapAPIBookToBook } from "@/utils/bookMapper";

async function getBooks() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/books?limit=100`, {
            next: { revalidate: 60 } // Revalidate every 60 seconds
        });

        if (!res.ok) {
            return [];
        }

        const data = await res.json();
        return data.data.map(mapAPIBookToBook);
    } catch (error) {
        console.error('Failed to fetch books:', error);
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
