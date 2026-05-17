"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "@/app/context/AuthContext";
import {cartService} from "@/api/services/cartService";

type CartItem = {
  size: any;
  id: string | number;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (item: Omit<CartItem, "qty">) => void;
  increaseQty: (id: string | number) => void;
  decreaseQty: (id: string | number) => void;
  removeItem: (id: string | number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: {children: React.ReactNode}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const {isAuthenticated, isLoading} = useAuth();

  // Load user cart from database
  const loadUserCart = async () => {
    try {
      const dbItems = await cartService.getCart();
      if (dbItems) {
        setCartItems(dbItems);
      }
    } catch (error) {
      console.error("Failed to load user cart from DB:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  // Monitor auth changes and load/clear cart accordingly
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        loadUserCart();
      } else {
        setCartItems([]);
        setIsLoaded(true);
      }
    }
  }, [isAuthenticated, isLoading]);

  // Sync cart items to Database (if authenticated)
  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      cartService.syncCart(cartItems).catch((err) => {
        console.error("Failed to sync cart to DB:", err);
      });
    }
  }, [cartItems, isLoaded, isAuthenticated]);

  const addToCart = (item: Omit<CartItem, "qty">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) => (i.id === item.id ? {...i, qty: i.qty + 1} : i));
      }

      return [...prev, {...item, qty: 1}];
    });
  };

  const increaseQty = (id: string | number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? {...item, qty: item.qty + 1} : item,
      ),
    );
  };

  const decreaseQty = (id: string | number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? {...item, qty: item.qty - 1} : item))
        .filter((item) => item.qty > 0),
    );
  };

  const removeItem = (id: string | number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
