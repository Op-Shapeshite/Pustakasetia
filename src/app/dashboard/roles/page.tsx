'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import RoleManagementPage from '@/components/admin/RoleManagementPage';

export default function RolesPage() {
    return (
        <AdminLayout title="PENGELOLAAN ROLE">
            <RoleManagementPage />
        </AdminLayout>
    );
}
