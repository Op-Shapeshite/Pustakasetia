'use client';

import { useState } from 'react';
import { roleService } from '@/utils/adminData';
import BaseModal from './BaseModal';

interface AddRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddRoleModal({ isOpen, onClose, onSuccess }: AddRoleModalProps) {
    const [formData, setFormData] = useState({ name: '', description: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        roleService.create(formData);
        onSuccess();
        onClose();
        setFormData({ name: '', description: '' });
    };

    const footer = (
        <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-[#2f2f2f] rounded-lg font-medium text-[#2f2f2f] hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" form="add-role-form" className="flex-1 px-4 py-3 bg-[#ffcc00] rounded-lg font-semibold text-[#2f2f2f] hover:opacity-90 transition-opacity">Tambah</button>
        </div>
    );

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="TAMBAH DATA ROLE" size="sm" footer={footer}>
            <form id="add-role-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm text-gray-500 mb-2">Role</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Masukkan role" required className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" />
                </div>
                <div>
                    <label className="block text-sm text-gray-500 mb-2">Deskripsi</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Masukkan deskripsi dari role" rows={4} className="w-full bg-white border border-[#d9d9d9] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ffcc00] resize-none" />
                </div>
            </form>
        </BaseModal>
    );
}
