"use client";

import {useCart} from "@/app/context/CartContext";
import Image from "next/image";
import { getCleanImageUrl } from "@/utils/image";
import {FaMinus, FaPlus, FaTimes, FaTrash} from "react-icons/fa";
import {useRouter} from "next/navigation";
import {useState} from "react";

type Props = {
  show: boolean;
  onClose: () => void;
};

const HEADER_HEIGHT = 80; // 🔥 adjust based on your navbar height

const CartDrawer = ({show, onClose}: Props) => {
  const router = useRouter();
  const {cartItems, increaseQty, decreaseQty, removeItem} = useCart();

  const [orderType, setOrderType] = useState<"delivery" | "takeaway">(
    "delivery",
  );

  if (!show) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const originalSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.qty,
    0,
  );

  const totalDiscount = originalSubtotal - subtotal;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}></div>

      <div
        className="fixed right-0 w-full max-w-md bg-white z-50 shadow-xl flex flex-col"
        style={{
          top: HEADER_HEIGHT,
          height: `calc(100% - ${HEADER_HEIGHT}px)`,
        }}
      >
        {" "}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">My Cart</h2>

          <button onClick={onClose}>
            <FaTimes size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-4 border-b"
            >
              <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={getCleanImageUrl(item.image)}
                  alt={item.name}
                  className="object-cover w-full h-full absolute inset-0"
                />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">{item.name}</p>
                <div className="flex gap-2 items-center flex-wrap mt-0.5">
                  {item.originalPrice && item.originalPrice > item.price ? (
                    <>
                      <span className="text-xs text-gray-400 line-through">
                        €{item.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-[var(--primary-color)]">
                        €{item.price.toFixed(2)}
                      </span>
                      <span className="text-[9px] font-black text-green-700 bg-green-100/60 px-1.5 py-0.5 rounded-md tracking-wider">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500 font-medium">
                      €{item.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition"
                >
                  <FaMinus size={10} />
                </button>

                <span className="font-semibold text-sm w-5 text-center">
                  {item.qty}
                </span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white"
                >
                  <FaPlus size={10} />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="p-5 border-t bg-gray-50/20">
          {totalDiscount > 0 ? (
            <div className="space-y-2.5 mb-5 text-sm text-gray-600">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>€{originalSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount</span>
                <span>-€{totalDiscount.toFixed(2)}</span>
              </div>
              <hr className="border-gray-100/60" />
              <div className="flex justify-between font-bold text-base text-gray-800 pt-1">
                <span>Total</span>
                <span className="text-[var(--primary-color)]">€{subtotal.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-between mb-4 font-bold text-gray-800">
              <span>Subtotal</span>
              <span className="text-[var(--primary-color)] font-extrabold">€{subtotal.toFixed(2)}</span>
            </div>
          )}

          <button
            onClick={() => {
              onClose();
              setTimeout(() => {
                router.push(`/checkout?type=${orderType}`);
              }, 100);
            }}
            className="w-full bg-[var(--primary-color)] text-white py-4 rounded-full font-semibold"
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
