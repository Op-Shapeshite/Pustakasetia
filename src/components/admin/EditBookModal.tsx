'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import { bookService, categoryService, Book } from '@/utils/adminData';
import dynamic from 'next/dynamic';
import SearchableSelect from './SearchableSelect';
import AuthorAutocomplete from './AuthorAutocomplete';
import BaseModal from './BaseModal';

// Dynamically import RichTextEditor to prevent SSR issues
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-[200px] bg-gray-100 border border-[#d9d9d9] rounded-lg animate-pulse" />
});

interface EditBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    book: Book;
}

interface Category {
    id: number;
    name: string;
}

// Format number to Rupiah display
const formatRupiah = (value: string): string => {
    const number = value.replace(/\D/g, '');
    if (!number) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(number));
};

// Parse Rupiah string to number
const parseRupiah = (value: string): string => {
    return value.replace(/\D/g, '');
};

export default function EditBookModal({ isOpen, onClose, onSuccess, book }: EditBookModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        authors: [''],
        pages: '',
        size: '',
        paper_type: '',
        isbn: '',
        price: '',
        priceDisplay: '',
        categoryId: '',
        edition: '',
        synopsis: '',
        image: '',
    });

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await categoryService.getAll({ limit: 50 });
                setCategories(response.data);
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };
        loadCategories();
    }, []);

    // Load book data when book changes
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                authors: book.author ? book.author.split(' & ') : [''],
                pages: String(book.pages),
                size: book.size,
                paper_type: book.paper_type || 'HVS',
                isbn: book.isbn,
                price: String(book.price),
                priceDisplay: formatRupiah(String(book.price)),
                categoryId: book.categoryId?.toString() || '',
                edition: book.edition,
                synopsis: book.synopsis,
                image: book.image || '',
            });
            setCoverPreview(book.image || null);
        }
    }, [book]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = parseRupiah(e.target.value);
        const displayValue = formatRupiah(rawValue);
        setFormData(prev => ({
            ...prev,
            price: rawValue,
            priceDisplay: displayValue
        }));
    };

    const handleSynopsisChange = (content: string) => {
        setFormData(prev => ({ ...prev, synopsis: content }));
    };




    // Create new category via API
    const handleCreateCategory = async (name: string): Promise<Category | null> => {
        try {
            const newCategory = await categoryService.create({ name });
            setCategories(prev => [...prev, newCategory]);
            return newCategory;
        } catch (err) {
            console.error('Failed to create category:', err);
            return null;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Format file tidak valid. Hanya JPEG, PNG, WebP yang diizinkan.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File terlalu besar. Maksimal 5MB.');
            return;
        }

        setUploadError(null);
        setIsUploading(true);

        try {
            const uploadData = new FormData();
            uploadData.append('file', file);
            const token = localStorage.getItem('auth_token');

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: uploadData,
            });

            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const result = await response.json();
            setFormData(prev => ({ ...prev, image: result.url }));
            setCoverPreview(result.url);
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Gagal mengupload gambar');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInputRef.current.files = dataTransfer.files;
            const event = new Event('change', { bubbles: true });
            fileInputRef.current.dispatchEvent(event);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await bookService.update(book.id, {
                title: formData.title,
                author: formData.authors.filter(a => a.trim()).join(' & '),
                pages: parseInt(formData.pages) || 0,
                size: formData.size,
                paper_type: formData.paper_type,
                isbn: formData.isbn,
                price: parseInt(formData.price) || 0,
                categoryId: parseInt(formData.categoryId),
                edition: formData.edition,
                synopsis: formData.synopsis,
                image: formData.image,
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to update book:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const footer = (
        <div className="flex justify-end gap-4">
            <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 border border-[#2f2f2f] rounded-lg font-medium text-[#2f2f2f] hover:bg-gray-100 transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                form="edit-book-form"
                disabled={isSubmitting || isUploading}
                className="px-8 py-3 bg-[#ffcc00] rounded-lg font-semibold text-[#2f2f2f] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Simpan
            </button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="EDIT DATA BUKU"
            size="xl"
            footer={footer}
        >
            <form id="edit-book-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                    {/* Left: Cover Upload */}
                    <div>
                        <p className="font-['Poppins',sans-serif] text-sm text-gray-500 mb-3">Cover Buku</p>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className={`aspect-[3/4] bg-white border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#ffcc00] transition-colors overflow-hidden ${uploadError ? 'border-red-400' : 'border-gray-300'}`}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-12 h-12 text-[#ffcc00] mb-3 animate-spin" />
                                    <p className="text-sm text-gray-500">Mengupload...</p>
                                </>
                            ) : coverPreview ? (
                                <img
                                    src={coverPreview}
                                    alt="Cover Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/img/book-cover-optimized.png';
                                    }}
                                />
                            ) : (
                                <>
                                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                    <p className="text-sm text-gray-500">Upload Cover</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG max 5MB</p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        {uploadError && (
                            <p className="text-xs text-red-500 mt-2">{uploadError}</p>
                        )}
                        <p className="text-xs text-[#c1121f] mt-2">*Cover Berukuran A4</p>
                    </div>

                    {/* Right: Form Fields */}
                    <div className="space-y-6">
                        {/* Row 1: Title */}
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

                        {/* Row 2: Authors */}
                        <div>
                            <AuthorAutocomplete
                                label="Penulis"
                                value={formData.authors}
                                onChange={(newAuthors) => setFormData(prev => ({ ...prev, authors: newAuthors }))}
                                placeholder="Cari atau tambah penulis..."
                            />
                        </div>

                        {/* Row 3: Specs Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Halaman</label>
                                <input
                                    type="number"
                                    value={formData.pages}
                                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                    required
                                    className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Ukuran</label>
                                <input
                                    type="text"
                                    value={formData.size}
                                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                    className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Kertas</label>
                                <input
                                    type="text"
                                    value={formData.paper_type}
                                    onChange={(e) => setFormData({ ...formData, paper_type: e.target.value })}
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

                        {/* Row 4: ISBN, Price, Category */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">Rp</span>
                                    <input
                                        type="text"
                                        value={formData.priceDisplay}
                                        onChange={handlePriceChange}
                                        required
                                        className="w-full bg-white border border-[#d9d9d9] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                    />
                                </div>
                            </div>
                            <div>
                                <SearchableSelect
                                    label="Kategori"
                                    options={categories}
                                    value={formData.categoryId}
                                    onChange={(value) => setFormData({ ...formData, categoryId: value })}
                                    onCreateNew={handleCreateCategory}
                                    placeholder="Pilih kategori..."
                                />
                            </div>
                        </div>

                        {/* Synopsis with WYSIWYG */}
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Sinopsis</label>
                            <RichTextEditor
                                value={formData.synopsis}
                                onChange={handleSynopsisChange}
                                placeholder="Masukkan sinopsis buku..."
                            />
                        </div>
                    </div>
                </div>
            </form>
        </BaseModal>
    );
}
