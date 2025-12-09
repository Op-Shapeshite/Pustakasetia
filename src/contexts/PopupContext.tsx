"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";

type PopupType = "success" | "info";

interface PopupContextType {
    showPopup: (message: string, type: PopupType, onClosed?: () => void) => void;
    hidePopup: () => void;
    popup: {
        isOpen: boolean;
        message: string;
        type: PopupType;
    };
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: ReactNode }) {
    const [popup, setPopup] = useState<{
        isOpen: boolean;
        message: string;
        type: PopupType;
    }>({
        isOpen: false,
        message: "",
        type: "success",
    });

    const onClosedRef = useRef<(() => void) | undefined>(undefined);

    const showPopup = (message: string, type: PopupType = "success", onClosed?: () => void) => {
        onClosedRef.current = onClosed;
        setPopup({ isOpen: true, message, type });
    };

    const hidePopup = () => {
        setPopup((prev) => ({ ...prev, isOpen: false }));

        // Execute callback if exists
        if (onClosedRef.current) {
            onClosedRef.current();
            onClosedRef.current = undefined; // Clear it to prevent double execution
        }
    };

    // Auto-close after 5 seconds
    useEffect(() => {
        if (popup.isOpen) {
            const timer = setTimeout(() => {
                hidePopup();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [popup.isOpen]);

    return (
        <PopupContext.Provider value={{ showPopup, hidePopup, popup }}>
            {children}
        </PopupContext.Provider>
    );
}

export function usePopup() {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within PopupProvider");
    }
    return context;
}
