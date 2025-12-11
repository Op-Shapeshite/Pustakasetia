'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, EyeOff } from 'lucide-react';
import { userService, roleService, Role, User } from '@/utils/adminData';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: User;
}

export default function EditUserModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
    const [mounted, setMounted] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        role: '',
        status: 'active' as 'active' | 'inactive',
    });

    useEffect(() => {
        setMounted(true);
        // Load roles asynchronously
        const loadRoles = async () => {
            try {
                const response = await roleService.getAll({ limit: 100 });
                setRoles(response.data);
            } catch (err) {
                console.error('Failed to load roles:', err);
            }
        };
        loadRoles();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName,
                username: user.username,
                password: '', // Password is not returned from API for security
                role: user.role.name,
                status: user.status,
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Only include password if it was changed
            const updateData: Record<string, unknown> = {
                fullName: formData.fullName,
                username: formData.username,
                roleId: roles.find(r => r.name === formData.role)?.id,
                status: formData.status,
            };
            if (formData.password) {
                updateData.password = formData.password;
            }
            await userService.update(user.id, updateData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to update user:', err);
        }
    };

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-[#f6f8fd] rounded-[24px] w-full max-w-[400px] shadow-xl">
                <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="font-['Poppins',sans-serif] font-medium text-xl text-black">EDIT DATA PENGGUNA</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-[#2f2f2f]" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">Nama Lengkap</label>
                        <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">
                            Username
                            {user.username === 'admin' && (
                                <span className="ml-2 text-xs text-orange-500">(tidak dapat diubah)</span>
                            )}
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            disabled={user.username === 'admin'}
                            className={`w-full border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00] ${user.username === 'admin'
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : 'bg-white'
                                }`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">Password</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" />
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
                        <button type="submit" className="flex-1 px-4 py-3 bg-[#ffcc00] rounded-lg font-semibold text-[#2f2f2f] hover:opacity-90 transition-opacity">Edit</button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
