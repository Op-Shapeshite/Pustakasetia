'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Hapus Data",
    message = "Apakah Anda yakin ingin menghapus data ini?"
}: DeleteConfirmModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-[#f6f8fd] rounded-[24px] p-8 w-full max-w-[540px] shadow-xl">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-[71px] h-[71px] bg-[#ffcc00] rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-[#2f2f2f]" />
                    </div>
                    <div className="flex-1 pt-2">
                        <h3 className="font-['Poppins',sans-serif] font-medium text-[#26262d] text-lg mb-2">{title}</h3>
                        <p className="font-['Poppins',sans-serif] text-gray-500 text-base">{message}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-6 py-2 border border-black rounded-[4px] font-['Poppins',sans-serif] font-semibold text-[#1e2a5e] text-sm hover:bg-gray-100 transition-colors">Batalkan</button>
                    <button onClick={() => { onConfirm(); onClose(); }} className="px-6 py-2 bg-[#df0404] rounded-[4px] font-['Poppins',sans-serif] font-semibold text-white text-sm hover:bg-red-600 transition-colors">Hapus</button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
