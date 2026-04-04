"use client";

import {useCart} from "@/app/context/CartContext";
import Image from "next/image";
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
        <div className="p-5">
          <div className="flex bg-gray-100 p-1 rounded-full w-fit">
            <button
              onClick={() => setOrderType("delivery")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                orderType === "delivery"
                  ? "bg-[var(--primary-color)] text-white shadow"
                  : "text-gray-600"
              }`}
            >
              Delivery
            </button>

            <button
              onClick={() => setOrderType("takeaway")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                orderType === "takeaway"
                  ? "bg-[var(--primary-color)] text-white shadow"
                  : "text-gray-600"
              }`}
            >
              Takeaway
            </button>
          </div>
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
        <div className="p-5 border-t">
          <div className="flex justify-between mb-4 font-semibold">
            <span>Subtotal</span>
            <span className="text-green-600">€{subtotal.toFixed(2)}</span>
          </div>

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
