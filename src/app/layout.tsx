import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/contexts/AppStateContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { PopupProvider } from "@/contexts/PopupContext";
import { Toaster } from "@/components/ui/sonner";
import { AnnouncementPopup } from "@/components/ui/AnnouncementPopup";
import NextTopLoader from 'nextjs-toploader';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import PageTracker from '@/components/PageTracker';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-poppins',
});

export const metadata: Metadata = {
    title: {
        default: "Pustaka Setia - Toko Buku Online Terlengkap",
        template: "%s | Pustaka Setia"
    },
    description: "Temukan koleksi buku terlengkap di Pustaka Setia. Beli buku online dengan harga terbaik untuk semua kalangan.",
    keywords: ['toko buku', 'beli buku online', 'pustaka setia', 'buku murah', 'toko buku indonesia'],
    authors: [{ name: 'Pustaka Setia' }],
    creator: 'Pustaka Setia',
    publisher: 'Pustaka Setia',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'id_ID',
        siteName: 'Pustaka Setia',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body className={`${poppins.variable} font-sans bg-neutral-50 min-h-screen w-full overflow-x-hidden`} suppressHydrationWarning>
                <GoogleAnalytics />
                <PageTracker />
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
                        <PopupProvider>
                            {children}
                            <AnnouncementPopup />
                            <Toaster />
                        </PopupProvider>
                    </ToastProvider>
                </AppStateProvider>
            </body>
        </html>
    );
}
