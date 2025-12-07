'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload } from 'lucide-react';
import { bookService, Book } from '@/utils/adminData';

interface EditBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    book: Book;
}

const categories = ['Pendidikan', 'Manajemen', 'Hukum', 'Agama', 'Bahasa', 'Sastra', 'Teknologi'];

export default function EditBookModal({ isOpen, onClose, onSuccess, book }: EditBookModalProps) {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        pages: '',
        size: '',
        isbn: '',
        price: '',
        category: '',
        edition: '',
        synopsis: '',
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                author: book.author,
                pages: String(book.pages),
                size: book.size,
                isbn: book.isbn,
                price: String(book.price),
                category: book.category,
                edition: book.edition,
                synopsis: book.synopsis,
            });
        }
    }, [book]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        bookService.update(book.id, {
            title: formData.title,
            author: formData.author,
            pages: parseInt(formData.pages) || 0,
            size: formData.size,
            isbn: formData.isbn,
            price: parseInt(formData.price) || 0,
            category: formData.category,
            edition: formData.edition,
            synopsis: formData.synopsis,
        });

        onSuccess();
        onClose();
    };

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-[#f6f8fd] rounded-[24px] w-full max-w-[1000px] max-h-[90vh] overflow-y-auto shadow-xl my-8">
                {/* Header */}
                <div className="sticky top-0 bg-[#f6f8fd] px-8 py-6 border-b border-gray-200 flex items-center justify-between z-10">
                    <h2 className="font-['Poppins',sans-serif] font-medium text-xl text-black">
                        EDIT DATA BUKU
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-[#2f2f2f]" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                        {/* Left: Cover */}
                        <div>
                            <p className="font-['Poppins',sans-serif] text-sm text-gray-500 mb-3">Cover Buku</p>
                            <div className="aspect-[3/4] bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xs text-[#c1121f] mt-2">*Cover Berukuran A4</p>
                        </div>

                        {/* Right: Form Fields */}
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Judul Buku</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Penulis</label>
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        required
                                        className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Jumlah Halaman</label>
                                    <input
                                        type="number"
                                        value={formData.pages}
                                        onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                        required
                                        className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Ukuran Buku</label>
                                    <input
                                        type="text"
                                        value={formData.size}
                                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                        className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Edisi</label>
                                    <input
                                        type="text"
                                        value={formData.edition}
                                        onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                                        className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">ISBN</label>
                                    <input
                                        type="text"
                                        value={formData.isbn}
                                        onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                        required
                                        className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Harga</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                        className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-2">Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Sinopsis</label>
                                <textarea
                                    value={formData.synopsis}
                                    onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                                    rows={5}
                                    className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00] resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3 border border-[#2f2f2f] rounded-lg font-medium text-[#2f2f2f] hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-[#ffcc00] rounded-lg font-semibold text-[#2f2f2f] hover:opacity-90 transition-opacity"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
