"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, X } from "lucide-react";
import { usePopup } from "../../contexts/PopupContext";

export function AnnouncementPopup() {
    const { popup, hidePopup } = usePopup();

    return (
        <AnimatePresence>
            {popup.isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="pointer-events-auto relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full mx-auto border border-neutral-100 flex flex-col items-center text-center gap-4"
                    >
                        <button
                            onClick={hidePopup}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${popup.type === "success"
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                                }`}
                        >
                            {popup.type === "success" ? (
                                <CheckCircle className="w-8 h-8" />
                            ) : (
                                <Info className="w-8 h-8" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-['Poppins',sans-serif] font-bold text-xl text-neutral-900">
                                {popup.type === "success" ? "Berhasil!" : "Informasi"}
                            </h3>
                            <p className="font-['Poppins',sans-serif] text-neutral-600 font-medium">
                                {popup.message}
                            </p>
                        </div>

                        {/* Progress Bar Animation */}
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className={`h-1.5 rounded-full w-full mt-2 ${popup.type === "success" ? "bg-green-500" : "bg-blue-500"
                                }`}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
