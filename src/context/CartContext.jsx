import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((item) => {
    setCartItems((prevItems) => {
      // Check if exact variant and comment combo already exists to merge quantities
      const existingItemIndex = prevItems.findIndex(
        (i) => i.productVariantId === item.productVariantId && (i.comment || '') === (item.comment || '')
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += item.quantity;
        newItems[existingItemIndex].lineTotal = newItems[existingItemIndex].quantity * newItems[existingItemIndex].unitPrice;
        return newItems;
      }

      return [...prevItems, { ...item, lineTotal: item.quantity * item.unitPrice }];
    });
  }, []);

  const removeFromCart = useCallback((productVariantId, comment = '') => {
    setCartItems((prevItems) => 
      prevItems.filter((i) => !(i.productVariantId === productVariantId && (i.comment || '') === comment))
    );
  }, []);

  const updateQuantity = useCallback((productVariantId, quantity, comment = '') => {
    setCartItems((prevItems) => 
      prevItems.map((item) => {
        if (item.productVariantId === productVariantId && (item.comment || '') === comment) {
          return { ...item, quantity, lineTotal: quantity * item.unitPrice };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.lineTotal, 0), [cartItems]);
  const cartCount = useMemo(() => cartItems.reduce((count, item) => count + item.quantity, 0), [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
