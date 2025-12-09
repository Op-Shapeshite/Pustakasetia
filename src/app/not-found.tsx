import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-[#ffcc00]">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                    Halaman Tidak Ditemukan
                </h2>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">
                    Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                </p>
                <div className="mt-8 flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="bg-[#ffcc00] text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                    >
                        Kembali ke Beranda
                    </Link>
                    <Link
                        href="/products"
                        className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                        Lihat Produk
                    </Link>
                </div>
            </div>
        </div>
    );
}
