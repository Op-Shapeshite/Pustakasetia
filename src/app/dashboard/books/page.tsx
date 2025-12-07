'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import BookManagementPage from '@/components/admin/BookManagementPage';

export default function BooksPage() {
    return (
        <AdminLayout title="PENGELOLAAN BUKU">
            <BookManagementPage />
        </AdminLayout>
    );
}
