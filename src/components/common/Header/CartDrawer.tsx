"use client";

import {useCart} from "@/app/context/CartContext";
import Image from "next/image";
import {FaMinus, FaPlus, FaTimes, FaTrash} from "react-icons/fa";
import {useRouter} from "next/navigation";

type Props = {
  show: boolean;
  onClose: () => void;
};

const CartDrawer = ({show, onClose}: Props) => {
  const router = useRouter();
  const {cartItems, increaseQty, decreaseQty, removeItem} = useCart();

  if (!show) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}></div>

      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">My Cart</h2>

          <button onClick={onClose} className="text-[var(--primary-color)]">
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-5 flex gap-2">
          <button className="px-5 py-2 rounded-full bg-[var(--primary-color)] text-white">
            Delivery
          </button>

          <button className="px-5 py-2 rounded-full bg-gray-200 text-gray-700">
            Takeaway
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-4 border-b"
            >
              {item.image && (
                <div className="relative w-14 h-14 rounded-md overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  €{item.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="text-[var(--primary-color)] border rounded-full w-7 h-7 flex items-center justify-center"
                >
                  <FaMinus size={10} />
                </button>

                <span>{item.qty}</span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="text-[var(--primary-color)] border rounded-full w-7 h-7 flex items-center justify-center"
                >
                  <FaPlus size={10} />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-[var(--primary-color)] ml-2"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-5 border-t">
          <div className="flex justify-between mb-4 font-semibold">
            <span>Subtotal</span>
            <span className="text-green-600">€{subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              setTimeout(() => {
                router.push("/checkout");
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
