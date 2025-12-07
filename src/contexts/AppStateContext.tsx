'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image?: string;
}

interface AppState {
    cart: CartItem[];
    isLoggedIn: boolean;
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    login: () => void;
    logout: () => void;
}

// Create context
const AppStateContext = createContext<AppState | undefined>(undefined);

// Provider component
export function AppStateProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load state from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cart');
            const savedAuth = localStorage.getItem('isLoggedIn');

            if (savedCart) {
                try {
                    setCart(JSON.parse(savedCart));
                } catch (e) {
                    console.error('Failed to parse cart from localStorage', e);
                }
            }

            if (savedAuth) {
                setIsLoggedIn(savedAuth === 'true');
            }

            setIsInitialized(true);
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isInitialized && typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isInitialized]);

    // Save auth to localStorage whenever it changes
    useEffect(() => {
        if (isInitialized && typeof window !== 'undefined') {
            localStorage.setItem('isLoggedIn', String(isLoggedIn));
        }
    }, [isLoggedIn, isInitialized]);

    const addToCart = (item: Omit<CartItem, 'quantity'>) => {
        setCart(prev => {
            const existingItem = prev.find(i => i.id === item.id);
            if (existingItem) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCart(prev =>
            prev.map(item => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    const value: AppState = {
        cart,
        isLoggedIn,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        login,
        logout,
    };

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
}

// Custom hook to use the app state
export function useAppState() {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
}
