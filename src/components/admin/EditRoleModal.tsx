'use client';

import { useState, useEffect } from 'react';
import { roleService, Role } from '@/utils/adminData';
import BaseModal from './BaseModal';

interface EditRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    role: Role;
}

export default function EditRoleModal({ isOpen, onClose, onSuccess, role }: EditRoleModalProps) {
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        if (role) {
            setFormData({ name: role.name, description: role.description || '' });
        }
    }, [role]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        roleService.update(role.id, formData);
        onSuccess();
        onClose();
    };

    const footer = (
        <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-[#2f2f2f] rounded-lg font-medium text-[#2f2f2f] hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" form="edit-role-form" className="flex-1 px-4 py-3 bg-[#ffcc00] rounded-lg font-semibold text-[#2f2f2f] hover:opacity-90 transition-opacity">Edit</button>
        </div>
    );

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="EDIT DATA ROLE" size="sm" footer={footer}>
            <form id="edit-role-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm text-gray-500 mb-2">Role</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" />
                </div>
                <div>
                    <label className="block text-sm text-gray-500 mb-2">Deskripsi</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00] resize-none" />
                </div>
            </form>
        </BaseModal>
    );
}
