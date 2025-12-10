'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import BaseModal from './BaseModal';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title?: string;
    message?: string;
    isLoading?: boolean;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Hapus Data",
    message = "Apakah Anda yakin ingin menghapus data ini?",
    isLoading = false
}: DeleteConfirmModalProps) {

    const handleConfirm = async () => {
        await onConfirm();
    };

    const footer = (
        <div className="flex justify-end gap-3">
            <button
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 border border-black rounded-[4px] font-['Poppins',sans-serif] font-semibold text-[#1e2a5e] text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
                Batalkan
            </button>
            <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="px-6 py-2 bg-[#df0404] rounded-[4px] font-['Poppins',sans-serif] font-semibold text-white text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Menghapus...' : 'Hapus'}
            </button>
        </div>
    );

    return (
        <BaseModal isOpen={isOpen} onClose={isLoading ? () => { } : onClose} title="" size="sm" footer={footer}>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-[71px] h-[71px] bg-[#ffcc00] rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-[#2f2f2f]" />
                </div>
                <div className="flex-1 pt-2">
                    <h3 className="font-['Poppins',sans-serif] font-medium text-[#26262d] text-lg mb-2">{title}</h3>
                    <p className="font-['Poppins',sans-serif] text-gray-500 text-base">{message}</p>
                </div>
            </div>
        </BaseModal>
    );
}
