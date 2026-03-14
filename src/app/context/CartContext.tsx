"use client";

import {createContext, useContext, useState} from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (item: CartItem) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: {children: React.ReactNode}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  return (
    <CartContext.Provider value={{cartItems, cartTotal, addToCart}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
