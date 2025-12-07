'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import UserManagementPage from '@/components/admin/UserManagementPage';

export default function UsersPage() {
    return (
        <AdminLayout title="PENGELOLAAN PENGGUNA">
            <UserManagementPage />
        </AdminLayout>
    );
}
