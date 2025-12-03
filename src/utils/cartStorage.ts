export interface CartItem {
  id: number;
  image: string;
  title: string;
  author: string;
  price: string;
  isbn?: string;
  edition?: string;
  quantity: number;
}

const CART_STORAGE_KEY = 'pustaka_setia_cart';

export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

export const addToCart = (item: Omit<CartItem, 'quantity'>): void => {
  const currentCart = getCartItems();
  
  // Check if item already exists
  const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);
  
  if (existingItemIndex > -1) {
    // Increase quantity if item exists
    currentCart[existingItemIndex].quantity += 1;
  } else {
    // Add new item with quantity 1
    currentCart.push({ ...item, quantity: 1 });
  }
  
  saveCart(currentCart);
};

export const removeFromCart = (itemId: number): void => {
  const currentCart = getCartItems();
  const updatedCart = currentCart.filter(item => item.id !== itemId);
  saveCart(updatedCart);
};

export const updateCartItemQuantity = (itemId: number, quantity: number): void => {
  if (quantity < 1) {
    removeFromCart(itemId);
    return;
  }
  
  const currentCart = getCartItems();
  const itemIndex = currentCart.findIndex(item => item.id === itemId);
  
  if (itemIndex > -1) {
    currentCart[itemIndex].quantity = quantity;
    saveCart(currentCart);
  }
};

export const clearCart = (): void => {
  saveCart([]);
};

export const getCartTotal = (): number => {
  const items = getCartItems();
  return items.reduce((total, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ''));
    return total + (price * item.quantity);
  }, 0);
};

export const getCartItemCount = (): number => {
  const items = getCartItems();
  return items.reduce((count, item) => count + item.quantity, 0);
};

const saveCart = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};
