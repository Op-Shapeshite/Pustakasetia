'use client';

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    maxHeight?: string;
}

export default function BaseModal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'lg',
    maxHeight = '85vh'
}: BaseModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-[1000px]',
        xl: 'max-w-[1200px]'
    };

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal Card - NO overflow-y-auto here */}
            <div
                className={`relative bg-[#f6f8fd] rounded-[24px] w-full ${sizeClasses[size]} shadow-xl flex flex-col`}
                style={{ maxHeight }}
            >
                {/* Sticky Header */}
                <div className="sticky top-0 bg-[#f6f8fd] px-8 py-6 border-b border-gray-200 flex items-center justify-between z-10 rounded-t-[24px]">
                    <h2 className="font-['Poppins',sans-serif] font-medium text-xl text-black">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-[#2f2f2f]" />
                    </button>
                </div>

                {/* Scrollable Content - Scrollbar is HERE, inside the card */}
                <div className="overflow-y-auto flex-1 px-8 py-6">
                    {children}
                </div>

                {/* Footer (if provided) */}
                {footer && (
                    <div className="sticky bottom-0 bg-[#f6f8fd] px-8 py-6 border-t border-gray-200 rounded-b-[24px]">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
