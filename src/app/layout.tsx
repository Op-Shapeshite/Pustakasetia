import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/contexts/AppStateContext";

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
                <AppStateProvider>
                    {children}
                </AppStateProvider>
            </body>

        </html>
    );
}
