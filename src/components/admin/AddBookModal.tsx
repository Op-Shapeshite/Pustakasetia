'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import { bookService, categoryService } from '@/utils/adminData';
import dynamic from 'next/dynamic';
import SearchableSelect from './SearchableSelect';
import AuthorAutocomplete from './AuthorAutocomplete';
import BaseModal from './BaseModal';

// Dynamically import RichTextEditor to prevent SSR issues
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
    ssr: false,
    loading: () => <div className="h-[200px] bg-gray-100 border border-[#d9d9d9] rounded-lg animate-pulse" />
});

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
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

// Format ISBN with dashes (978-XXX-XXX-XXX-X)
const formatISBN = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length <= 12) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}-${digits.slice(9)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}-${digits.slice(9, 12)}-${digits.slice(12)}`;
};

export default function AddBookModal({ isOpen, onClose, onSuccess }: AddBookModalProps) {
    const [mounted, setMounted] = useState(false);
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
        size: '16 x 24 cm',
        paper_type: 'HVS',
        isbn: '',
        price: '',
        priceDisplay: '',
        categoryId: '',
        edition: 'Ke-1. 2025',
        synopsis: '',
        image: '',
    });

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await categoryService.getAll({ limit: 50 });
                setCategories(response.data);
                if (response.data.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: response.data[0].id.toString() }));
                }
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };
        loadCategories();
    }, []);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = parseRupiah(e.target.value);
        const displayValue = formatRupiah(rawValue);
        setFormData(prev => ({
            ...prev,
            price: rawValue,
            priceDisplay: displayValue
        }));
    };

    const handleISBNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatISBN(e.target.value);
        setFormData(prev => ({ ...prev, isbn: formatted }));
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
            await bookService.create({
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
                image: formData.image || '/img/book-cover-optimized.png',
                stock: 0,
            });

            onSuccess();
            onClose();
            resetForm();
        } catch (err) {
            console.error('Failed to create book:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            authors: [''],
            pages: '',
            size: '16 x 24 cm',
            paper_type: 'HVS',
            isbn: '',
            price: '',
            priceDisplay: '',
            categoryId: categories[0]?.id.toString() || '',
            edition: 'Ke-1. 2025',
            synopsis: '',
            image: '',
        });
        setCoverPreview(null);
        setUploadError(null);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

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
                form="add-book-form"
                disabled={isSubmitting || isUploading}
                className="px-8 py-3 bg-[#ffcc00] rounded-lg font-semibold text-[#2f2f2f] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Tambah
            </button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="TAMBAH DATA BUKU"
            size="xl"
            footer={footer}
        >
            <form id="add-book-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                    {/* Left: Cover Upload */}
                    <div>
                        <p className="font-['Poppins',sans-serif] text-sm text-gray-500 mb-3">Cover Buku</p>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className={`aspect-[3/4] bg-white border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#ffcc00] transition-colors overflow-hidden ${uploadError ? 'border-red-400' : 'border-gray-300'
                                }`}
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
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG max 2MB</p>
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
                                placeholder="Masukkan judul buku"
                                required
                                className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                            />
                        </div>

                        {/* Row 2: Authors (Multi-select) */}
                        <div>
                            <AuthorAutocomplete
                                label="Penulis"
                                value={formData.authors}
                                onChange={(newAuthors) => setFormData(prev => ({ ...prev, authors: newAuthors }))}
                                placeholder="Cari atau tambah penulis..."
                            />
                        </div>

                        {/* Row 3: Specs Grid - Pages, Size, Paper, Edition */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Halaman</label>
                                <input
                                    type="number"
                                    value={formData.pages}
                                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                    placeholder="Total"
                                    min="0"
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
                                    placeholder="16 x 24"
                                    className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Kertas</label>
                                <input
                                    type="text"
                                    value={formData.paper_type}
                                    onChange={(e) => setFormData({ ...formData, paper_type: e.target.value })}
                                    placeholder="HVS"
                                    className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-2">Edisi</label>
                                <input
                                    type="text"
                                    value={formData.edition}
                                    onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                                    placeholder="Ke-1"
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
                                    onChange={handleISBNChange}
                                    placeholder="978-..."
                                    required
                                    maxLength={17}
                                    className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00] font-mono"
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
                                        placeholder="0"
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
                                    placeholder="Pilih..."
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

// End of AddBookModal Component
