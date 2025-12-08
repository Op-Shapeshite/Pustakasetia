'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { bookService, Book } from '@/utils/adminData';
import { useDebounce } from '@/hooks/useDebounce';
import AddBookModal from './AddBookModal';
import EditBookModal from './EditBookModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function BookManagementPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search query
    const debouncedSearch = useDebounce(searchQuery, 500);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadBooks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await bookService.getAll({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch
            });
            setBooks(response.data);
            setTotalItems(response.pagination.total);
            setTotalPages(response.pagination.totalPages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load books');
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, debouncedSearch]);

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    const handleEdit = (book: Book) => {
        setSelectedBook(book);
        setIsEditModalOpen(true);
    };

    const handleDelete = (book: Book) => {
        setSelectedBook(book);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedBook) {
            try {
                setIsDeleting(true);
                await bookService.delete(selectedBook.id);
                await loadBooks();
                setSelectedBook(null);
                setIsDeleteModalOpen(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete book');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const formatPrice = (price: number) => {
        return `Rp${price.toLocaleString('id-ID')}`;
    };

    if (loading && books.length === 0) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#ffcc00]" />
                <span className="ml-2 text-gray-500">Memuat data...</span>
            </div>
        );
    }

    return (
        <div className="p-6">
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                    <button onClick={loadBooks} className="ml-2 underline">Coba lagi</button>
                </div>
            )}

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-[#2f2f2f]">Daftar Buku</h2>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari buku..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-[250px] text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-[#ffcc00] text-[#2f2f2f] px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Buku
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#ffcc00]">
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">No</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Judul Buku</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Halaman</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Ukuran</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">ISBN</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Harga</th>
                                <th className="text-center px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book, index) => (
                                <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-[#2f2f2f]">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={book.image || '/img/book-cover-optimized.png'}
                                                alt={book.title}
                                                className="w-10 h-14 object-cover rounded"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-[#2f2f2f] line-clamp-1">{book.title}</p>
                                                <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#2f2f2f]">{book.pages}</td>
                                    <td className="px-4 py-3 text-sm text-[#2f2f2f]">{book.size}</td>
                                    <td className="px-4 py-3 text-sm text-[#2f2f2f] font-mono">{book.isbn}</td>
                                    <td className="px-4 py-3 text-sm text-[#2f2f2f]">{formatPrice(book.price)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(book)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4 text-blue-500" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && books.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                        {searchQuery ? 'Tidak ada buku yang ditemukan' : 'Belum ada data buku'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Always show info bar */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Menampilkan {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} data
                    </p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-[#2f2f2f]">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddBookModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadBooks}
            />

            {selectedBook && (
                <EditBookModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedBook(null);
                    }}
                    onSuccess={loadBooks}
                    book={selectedBook}
                />
            )}

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedBook(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Buku"
                message={`Apakah Anda yakin ingin menghapus buku "${selectedBook?.title}"?`}
                isLoading={isDeleting}
            />
        </div>
    );
}
