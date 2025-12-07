import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/contexts/AppStateContext";

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
            <body className="bg-neutral-50 min-h-screen w-full overflow-x-hidden">
                <AppStateProvider>
                    {children}
                </AppStateProvider>
            </body>
        </html>
    );
}
