'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import RoleGuard from '@/components/admin/RoleGuard';
import UserManagementPage from '@/components/admin/UserManagementPage';

export default function UsersPage() {
    return (
        <AdminLayout title="PENGELOLAAN PENGGUNA">
            <RoleGuard allowedRoles={['Admin']}>
                <UserManagementPage />
            </RoleGuard>
        </AdminLayout>
    );
}
