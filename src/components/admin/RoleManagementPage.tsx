'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { roleService, Role } from '@/utils/adminData';
import AddRoleModal from './AddRoleModal';
import EditRoleModal from './EditRoleModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function RoleManagementPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadRoles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await roleService.getAll({ limit: 100 });
            setRoles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load roles');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRoles();
    }, [loadRoles]);

    // Filter roles by search
    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage);

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setIsEditModalOpen(true);
    };

    const handleDelete = (role: Role) => {
        setSelectedRole(role);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedRole) {
            try {
                setIsDeleting(true);
                await roleService.delete(selectedRole.id);
                await loadRoles();
                setSelectedRole(null);
                setIsDeleteModalOpen(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete role');
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
                    <button onClick={loadRoles} className="ml-2 underline">Coba lagi</button>
                </div>
            )}

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-[#2f2f2f]">Daftar Role</h2>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari role..."
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
                        Tambah Role
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
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Role</th>
                                <th className="text-left px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Deskripsi</th>
                                <th className="text-center px-4 py-3 font-semibold text-[#2f2f2f] text-sm">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedRoles.map((role, index) => (
                                <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-[#2f2f2f]">{startIndex + index + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-[#2f2f2f]">{role.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{role.description}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(role)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4 text-blue-500" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(role)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedRoles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        {searchQuery ? 'Tidak ada role yang ditemukan' : 'Belum ada data role'}
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
                            Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRoles.length)} dari {filteredRoles.length} data
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
            <AddRoleModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadRoles}
            />

            {selectedRole && (
                <EditRoleModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedRole(null);
                    }}
                    onSuccess={loadRoles}
                    role={selectedRole}
                />
            )}

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedRole(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Role"
                message={`Apakah Anda yakin ingin menghapus role "${selectedRole?.name}"?`}
                isLoading={isDeleting}
            />
        </div>
    );
}
