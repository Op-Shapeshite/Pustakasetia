import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/contexts/AppStateContext";
import { ToastProvider } from "@/contexts/ToastContext";
import NextTopLoader from 'nextjs-toploader';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: "Pustaka Setia - Your Online Bookstore",
    description: "Discover and purchase books from our extensive collection",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${poppins.variable} font-sans bg-neutral-50 min-h-screen w-full overflow-x-hidden`}>
                <NextTopLoader
                    color="#ffcc00"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={3}
                    crawl={true}
                    showSpinner={false}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px #ffcc00,0 0 5px #ffcc00"
                />
                <AppStateProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </AppStateProvider>
            </body>
        </html>
    );
}
