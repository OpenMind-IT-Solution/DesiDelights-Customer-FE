"use client";

import { FaBagShopping } from "react-icons/fa6";
import Button from "../Button/Button";
import { useState } from "react";

interface CartDrawerProps {
  show: boolean;
  onClose: () => void;
}

const CartDrawer = ({ show, onClose }: CartDrawerProps) => {
  if (!show) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-10"
        onClick={onClose}
      ></div>
      <div className={`fixed top-0 right-0 h-screen w-full max-w-sm bg-white shadow-lg transition-transform duration-300 z-10 transform ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="cursor-pointer">
            ✕
          </button>
        </div>

        <div className="p-4">
          <p>Your cart is empty.</p>
        </div>
      </div>
    </>
  );
};

const CartButton = () => {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  const handleCartDrawer = () => {
    setShowDrawer((prev) => !prev);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleCartDrawer}>
        <FaBagShopping />
        €0.00
      </Button>

      <CartDrawer show={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
};

export default CartButton;
