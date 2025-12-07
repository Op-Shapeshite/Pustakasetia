'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { userService, User } from '@/utils/adminData';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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
            const data = await userService.getAll({ limit: 100 });
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // Filter users by search
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = (user: User) => {
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

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#ffcc00]" />
                <span className="ml-2 text-gray-500">Memuat data...</span>
            </div>
        );
    }

    return (
        <div className="p-6">
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                    <button onClick={loadUsers} className="ml-2 underline">Coba lagi</button>
                </div>
            )}

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-[#2f2f2f]">Daftar Pengguna</h2>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari pengguna..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-[250px] text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-[#ffcc00] text-[#2f2f2f] px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Pengguna
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#ffcc00]">
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">No</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Nama Lengkap</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Username</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Role</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Status</th>
                                <th className="text-center px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user, index) => (
                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-[#2f2f2f]">{startIndex + index + 1}</td>
                                    <td className="px-4 py-3 text-sm text-[#2f2f2f]">{user.fullName}</td>
                                    <td className="px-4 py-3 text-sm text-[#2f2f2f]">{user.username}</td>
                                    <td className="px-4 py-3 text-sm text-[#2f2f2f]">{user.role}</td>
                                    <td className="px-4 py-3">
                                        <span className={`
                                            inline-flex px-3 py-1 rounded-full text-xs font-medium
                                            ${user.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }
                                        `}>
                                            {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4 text-blue-500" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                        {searchQuery ? 'Tidak ada pengguna yang ditemukan' : 'Belum ada data pengguna'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} dari {filteredUsers.length} data
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-[#2f2f2f]">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

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
        </div>
    );
}
