'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, EyeOff } from 'lucide-react';
import { userService, roleService, Role } from '@/utils/adminData';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
    const [mounted, setMounted] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        role: 'Admin',
        status: 'active' as 'active' | 'inactive',
    });

    useEffect(() => {
        setMounted(true);
        setRoles(roleService.getAll());
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        userService.create({
            fullName: formData.fullName,
            username: formData.username,
            password: formData.password,
            role: formData.role,
            status: formData.status,
        });

        onSuccess();
        onClose();
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            username: '',
            password: '',
            role: 'Admin',
            status: 'active',
        });
    };

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-[#f6f8fd] rounded-[24px] w-full max-w-[400px] shadow-xl">
                <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="font-['Poppins',sans-serif] font-medium text-xl text-black">
                        TAMBAH DATA PENGGUNA
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-[#2f2f2f]" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">Nama Lengkap</label>
                        <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Masukkan nama lengkap" required className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">Username</label>
                        <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="Masukkan username" required className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">Password</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Masukkan password" required className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">Role</label>
                        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]">
                            {roles.map(role => (<option key={role.id} value={role.name}>{role.name}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">Status</label>
                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]">
                            <option value="active">Aktif</option>
                            <option value="inactive">Tidak Aktif</option>
                        </select>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-[#2f2f2f] rounded-lg font-medium text-[#2f2f2f] hover:bg-gray-100 transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-3 bg-[#ffcc00] rounded-lg font-semibold text-[#2f2f2f] hover:opacity-90 transition-opacity">Tambah</button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
