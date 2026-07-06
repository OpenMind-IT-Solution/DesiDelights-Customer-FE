"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "@/app/context/AuthContext";
import {cartService} from "@/api/services/cartService";

type CartItem = {
  size: any;
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  qty: number;
  vatRate?: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (item: Omit<CartItem, "qty">) => void;
  increaseQty: (id: string | number) => void;
  decreaseQty: (id: string | number) => void;
  removeItem: (id: string | number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}: {children: React.ReactNode}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const {isAuthenticated, isLoading} = useAuth();

  // Load user cart from database and merge with guest cart
  const loadUserCart = async () => {
    try {
      const dbItems = (await cartService.getCart()) || [];
      const savedGuestCart = localStorage.getItem("guest_cart");
      let mergedItems = [...dbItems];
      let hasMerged = false;

      if (savedGuestCart) {
        try {
          const guestItems: CartItem[] = JSON.parse(savedGuestCart);
          if (Array.isArray(guestItems) && guestItems.length > 0) {
            guestItems.forEach((guestItem) => {
              const existingIdx = mergedItems.findIndex(
                (dbItem) => dbItem.id === guestItem.id,
              );
              if (existingIdx > -1) {
                mergedItems[existingIdx] = {
                  ...mergedItems[existingIdx],
                  qty: mergedItems[existingIdx].qty + guestItem.qty,
                };
              } else {
                mergedItems.push(guestItem);
              }
            });
            hasMerged = true;
            localStorage.removeItem("guest_cart");
          }
        } catch (e) {
          console.error("Failed to parse guest cart:", e);
        }
      }

      setCartItems(mergedItems);

      if (hasMerged && mergedItems.length > 0) {
        await cartService.syncCart(mergedItems).catch((err) => {
          console.error("Failed to sync merged cart:", err);
        });
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
        const savedGuestCart = localStorage.getItem("guest_cart");
        if (savedGuestCart) {
          try {
            const guestItems = JSON.parse(savedGuestCart);
            if (Array.isArray(guestItems)) {
              setCartItems(guestItems);
            } else {
              setCartItems([]);
            }
          } catch (e) {
            console.error("Failed to parse guest cart:", e);
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
        setIsLoaded(true);
      }
    }
  }, [isAuthenticated, isLoading]);

  // Sync cart items to localStorage (if guest) or Database (if authenticated)
  useEffect(() => {
    if (isLoaded) {
      if (isAuthenticated) {
        cartService.syncCart(cartItems).catch((err) => {
          console.error("Failed to sync cart to DB:", err);
        });
      } else {
        localStorage.setItem("guest_cart", JSON.stringify(cartItems));
      }
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

  const clearCart = () => {
    setCartItems([]);
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
        clearCart,
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
