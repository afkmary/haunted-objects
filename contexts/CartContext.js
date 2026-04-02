"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const getStockLimit = (product) => {
    const stock =
      typeof product.qty === "string"
        ? parseInt(product.qty, 10)
        : Number(product.qty);

    return Number.isNaN(stock) ? 0 : stock;
  };

  const addToCart = (product) => {
    const stockLimit = getStockLimit(product);

    if (stockLimit <= 0) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        if (existing.cartQty >= stockLimit) {
          return prev;
        }

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, cartQty: item.cartQty + 1 }
            : item
        );
      }

      return [...prev, { ...product, cartQty: 1 }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const increaseQty = (productId) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;

        const stockLimit = getStockLimit(item);

        if (item.cartQty >= stockLimit) {
          return item;
        }

        return { ...item, cartQty: item.cartQty + 1 };
      })
    );
  };

  const decreaseQty = (productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, cartQty: item.cartQty - 1 }
            : item
        )
        .filter((item) => item.cartQty > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.cartQty, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.cartQty, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}