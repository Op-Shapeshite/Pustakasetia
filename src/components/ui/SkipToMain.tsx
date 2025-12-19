'use client';

/**
 * SkipToMain - Accessible skip navigation link
 * Allows keyboard users to skip directly to main content
 */
export default function SkipToMain() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-yellow-500 focus:text-black focus:font-semibold focus:rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all"
            aria-label="Langsung ke konten utama"
        >
            Langsung ke Konten Utama
        </a>
    );
}
