'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { userService, User } from '@/utils/adminData';
import { useDebounce } from '@/hooks/useDebounce';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import AdminPageContainer from './AdminPageContainer';
import AdminDataTable, { Column } from './AdminDataTable';

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search query
    const debouncedSearch = useDebounce(searchQuery, 500);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getAll({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch
            });
            setUsers(response.data);
            setTotalItems(response.pagination.total);
            setTotalPages(response.pagination.totalPages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, debouncedSearch]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Reset page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = (user: User) => {
        // Prevent deletion of admin user
        if (user.username === 'admin') {
            setError('User admin tidak dapat dihapus');
            return;
        }
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedUser) {
            try {
                setIsDeleting(true);
                await userService.delete(selectedUser.id);
                await loadUsers();
                setSelectedUser(null);
                setIsDeleteModalOpen(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete user');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // Define table columns
    const columns: Column<User>[] = [
        {
            header: 'Id',
            render: (user, index) => (currentPage - 1) * itemsPerPage + index + 1,
            className: 'px-6 py-4 text-sm text-gray-900'
        },
        {
            header: 'Nama Lengkap',
            accessor: 'fullName',
            className: 'px-6 py-4 text-sm font-medium text-gray-900'
        },
        {
            header: 'Username',
            accessor: 'username',
            className: 'px-6 py-4 text-sm text-gray-700'
        },
        {
            header: 'Role',
            accessor: 'role.name',
            className: 'px-6 py-4 text-sm text-gray-700'
        },
        {
            header: 'Status',
            render: (user) => (
                <span className={`
                    inline-flex px-3 py-1 rounded-full text-xs font-medium
                    ${user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }
                `}>
                    {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </span>
            ),
            className: 'px-6 py-4'
        },
        {
            header: 'Aksi',
            headerClassName: 'text-center px-6 py-4 font-medium text-gray-600 text-sm whitespace-nowrap sticky right-0 bg-gray-50',
            render: (user) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(user)}
                        className={`p-2 rounded-lg transition-colors ${user.username === 'admin'
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                        title={user.username === 'admin' ? 'Admin tidak dapat dihapus' : 'Hapus'}
                        disabled={user.username === 'admin'}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
            className: 'px-6 py-4 sticky right-0 bg-white'
        }
    ];

    if (loading && users.length === 0) {
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
            searchPlaceholder="Cari pengguna..."
            limit={itemsPerPage}
            onLimitChange={(newLimit) => {
                setItemsPerPage(newLimit);
                setCurrentPage(1);
            }}
            onAddClick={() => setIsAddModalOpen(true)}
            addButtonText="Tambah Baru"
            error={error}
            onRetry={loadUsers}
        >
            <AdminDataTable
                columns={columns}
                data={users}
                loading={loading}
                searchQuery={searchQuery}
                emptyMessage="Belum ada data pengguna"
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

            {/* Modals */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadUsers}
            />

            {selectedUser && (
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onSuccess={loadUsers}
                    user={selectedUser}
                />
            )}

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Pengguna"
                message={`Apakah Anda yakin ingin menghapus pengguna "${selectedUser?.fullName}"?`}
                isLoading={isDeleting}
            />
        </AdminPageContainer>
    );
}
