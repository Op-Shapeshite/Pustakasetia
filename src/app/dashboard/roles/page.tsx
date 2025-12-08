'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import RoleGuard from '@/components/admin/RoleGuard';
import RoleManagementPage from '@/components/admin/RoleManagementPage';

export default function RolesPage() {
    return (
        <AdminLayout title="PENGELOLAAN ROLE">
            <RoleGuard allowedRoles={['Admin']}>
                <RoleManagementPage />
            </RoleGuard>
        </AdminLayout>
    );
}
