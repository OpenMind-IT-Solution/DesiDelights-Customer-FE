"use client";

import Image from "next/image";
import {useState, useEffect} from "react";
import {FaTimes} from "react-icons/fa";
import {useCart} from "@/app/context/CartContext";

type Item = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
};

type Props = {
  item: Item | null;
  onClose: () => void;
};

const MenuItemModal = ({item, onClose}: Props) => {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  const {addToCart} = useCart();

  useEffect(() => {
    setQty(1);
    setNote("");
  }, [item]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!item) return null;

  const basePrice = parseFloat(item.price.replace("€", ""));
  const totalPrice = (basePrice * qty).toFixed(2);

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: basePrice,
      image: item.image,
      qty: qty,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-lg animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[var(--primary-color)] hover:scale-110 transition"
        >
          <FaTimes size={18} />
        </button>

        <div className="flex gap-4 mb-4">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold">{item.name}</h2>

            <p className="text-lg font-semibold text-[var(--primary-color)] mt-1">
              €{basePrice.toFixed(2)}
            </p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6">{item.description}</p>

        <div className="flex items-center gap-4 mb-6">
          <span className="font-semibold">Quantity:</span>

          <button
            onClick={() => setQty((prev) => Math.max(1, prev - 1))}
            className="w-8 h-8 rounded-full border border-[var(--primary-color)] text-[var(--primary-color)] flex items-center justify-center hover:bg-[var(--primary-color)] hover:text-white transition"
          >
            -
          </button>

          <span className="font-semibold text-lg">{qty}</span>

          <button
            onClick={() => setQty((prev) => prev + 1)}
            className="w-8 h-8 rounded-full border border-[var(--primary-color)] text-[var(--primary-color)] flex items-center justify-center hover:bg-[var(--primary-color)] hover:text-white transition"
          >
            +
          </button>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-2">Special Instructions</p>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add note (extra mayo, cheese, etc.)"
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-[var(--primary-color)] text-white py-4 rounded-full font-semibold text-lg hover:opacity-90 transition"
        >
          Add to Cart - €{totalPrice}
        </button>
      </div>
    </div>
  );
};

export default MenuItemModal;
