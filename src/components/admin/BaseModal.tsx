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
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle animation states
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Small delay to trigger animation after render
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            });
        } else {
            setIsAnimating(false);
            // Wait for animation to complete before unmounting
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

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

    if (!shouldRender || !mounted) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-[1000px]',
        xl: 'max-w-[1200px]'
    };

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with fade animation */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ease-out ${isAnimating ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal Card with slide + scale animation */}
            <div
                className={`relative bg-[#f6f8fd] rounded-[24px] w-full ${sizeClasses[size]} shadow-2xl flex flex-col
                    transition-all duration-300 ease-out
                    ${isAnimating
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                style={{ maxHeight }}
            >
                {/* Sticky Header */}
                <div className="sticky top-0 bg-[#f6f8fd] px-8 py-6 border-b border-gray-200 flex items-center justify-between z-10 rounded-t-[24px]">
                    <h2 className="font-['Poppins',sans-serif] font-medium text-xl text-black">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-all duration-200 hover:rotate-90"
                    >
                        <X className="w-5 h-5 text-[#2f2f2f]" />
                    </button>
                </div>

                {/* Scrollable Content */}
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
