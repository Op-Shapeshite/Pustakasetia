'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { bookService, Book } from '@/utils/adminData';
import { useDebounce } from '@/hooks/useDebounce';
import AddBookModal from './AddBookModal';
import EditBookModal from './EditBookModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import AdminPageContainer from './AdminPageContainer';
import AdminDataTable, { Column } from './AdminDataTable';

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

    // Define table columns
    const columns: Column<Book>[] = [
        {
            header: 'Id',
            render: (book, index) => (currentPage - 1) * itemsPerPage + index + 1,
            className: 'px-6 py-6 text-sm text-gray-900 whitespace-nowrap'
        },
        {
            header: 'Cover',
            render: (book) => (
                <img
                    src={book.image || '/img/book-cover-optimized.png'}
                    alt={book.title}
                    className="w-48 h-full object-contain rounded-xl shadow-lg"
                />
            ),
            className: 'px-6 py-6'
        },
        {
            header: 'Judul Buku',
            render: (book) => (
                <p className="text-sm font-medium text-gray-900 line-clamp-2 max-w-[200px]">
                    {book.title}
                </p>
            ),
            className: 'px-6 py-6'
        },
        {
            header: 'Kategori',
            accessor: 'category.name',
            className: 'px-6 py-6 text-sm text-gray-700 whitespace-nowrap'
        },
        {
            header: 'Nama Penulis',
            accessor: 'author',
            className: 'px-6 py-6 text-sm text-gray-700 whitespace-nowrap'
        },
        {
            header: 'Jumlah Halaman',
            accessor: 'pages',
            className: 'px-6 py-6 text-sm text-gray-700 whitespace-nowrap'
        },
        {
            header: 'Ukuran Buku',
            accessor: 'size',
            className: 'px-6 py-6 text-sm text-gray-700 whitespace-nowrap'
        },
        {
            header: 'Jenis Kertas',
            render: () => 'HVS',
            className: 'px-6 py-6 text-sm text-gray-700 whitespace-nowrap'
        },
        {
            header: 'Cetakan',
            render: (book) => book.edition || 'Cetakan 1',
            className: 'px-6 py-6 text-sm text-gray-700 whitespace-nowrap'
        },
        {
            header: 'ISBN',
            accessor: 'isbn',
            className: 'px-6 py-6 text-sm text-gray-700 font-mono whitespace-nowrap'
        },
        {
            header: 'Harga',
            render: (book) => formatPrice(book.price),
            className: 'px-6 py-6 text-sm text-gray-900 font-medium whitespace-nowrap'
        },
        {
            header: 'Tindakan',
            render: (book) => (
                <div className="flex items-center justify-center gap-2 whitespace-nowrap">
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
            ),
            className: 'px-6 py-6',
            headerClassName: 'text-center px-6 py-4 font-medium text-gray-600 text-sm whitespace-nowrap'
        }
    ];

    if (loading && books.length === 0) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#ffcc00]" />
                <span className="ml-2 text-gray-500">Memuat data...</span>
            </div>
        );
    }

    return (
        <AdminPageContainer
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Cari buku..."
            onAddClick={() => setIsAddModalOpen(true)}
            addButtonText="Tambah Baru"
            error={error}
            onRetry={loadBooks}
        >
            <AdminDataTable
                columns={columns}
                data={books}
                loading={loading}
                searchQuery={searchQuery}
                emptyMessage="Belum ada data buku"
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

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
        </AdminPageContainer>
    );
}
