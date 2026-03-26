"use client";

import {useCart} from "@/app/context/CartContext";
import Image from "next/image";
import {useState} from "react";
import {FaPlus, FaMinus} from "react-icons/fa";
import AddressModal from "@/components/AddressModal";
import TimeModal from "@/components/TimeModal";

export default function CheckoutPage() {
  const {cartItems, increaseQty, decreaseQty} = useCart();

  // ADDRESS STATE
  const [addresses, setAddresses] = useState<
    {lat: number; lng: number; label: string; address: string}[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAddress, setShowAddress] = useState(false);

  // DELIVERY TYPE
  const [type, setType] = useState<"delivery" | "takeaway">("delivery");

  // TIME
  const [deliveryTime, setDeliveryTime] = useState<"now" | "schedule">("now");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  return (
    <div className="bg-[#f5f6f8] min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* DELIVERY ADDRESS */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Delivery Address</h2>

                <button
                  onClick={() => setShowAddress(true)}
                  className="bg-[var(--primary-color)]/10 text-[var(--primary-color)] px-4 py-2 rounded-full text-sm"
                >
                  + Add
                </button>
              </div>

              {/* ADDRESS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {addresses.length === 0 && (
                  <p className="text-sm text-gray-500">No address added yet</p>
                )}

                {addresses.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    className={`rounded-xl p-4 cursor-pointer transition ${
                      selectedIndex === i
                        ? "bg-[var(--primary-color)]/10 border border-[var(--primary-color)]"
                        : "bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold text-[var(--primary-color)]">
                        {item.label}
                      </p>

                      <span
                        className={`w-4 h-4 rounded-full border ${
                          selectedIndex === i
                            ? "bg-[var(--primary-color)] border-[var(--primary-color)]"
                            : "border-gray-400"
                        }`}
                      />
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.address || "Selected location"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* TIME SECTION */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">
                Preferred Time Frame For Delivery
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NOW */}
                <div
                  onClick={() => setDeliveryTime("now")}
                  className={`cursor-pointer rounded-xl p-5 ${
                    deliveryTime === "now"
                      ? "bg-white shadow-md"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between">
                    <p className="font-semibold">Now</p>
                    <span
                      className={`w-4 h-4 rounded-full ${
                        deliveryTime === "now"
                          ? "bg-[var(--primary-color)]"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-2">30 minutes</p>
                </div>

                {/* SCHEDULE */}
                <div
                  onClick={() => {
                    setDeliveryTime("schedule");
                    setShowTimeModal(true);
                  }}
                  className={`cursor-pointer rounded-xl p-5 ${
                    deliveryTime === "schedule"
                      ? "bg-white shadow-md"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between">
                    <p className="font-semibold">Schedule for later</p>

                    <span
                      className={`w-4 h-4 rounded-full ${
                        deliveryTime === "schedule"
                          ? "bg-[var(--primary-color)]"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    {selectedSlot || "Choose a time"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="font-bold text-xl mb-5">Cart Summary</h2>

                {/* DELIVERY TOGGLE */}
                <div className="flex bg-gray-200 p-1 rounded-full w-fit mb-6">
                  <button
                    onClick={() => setType("delivery")}
                    className={`px-6 py-2 rounded-full text-sm font-medium ${
                      type === "delivery"
                        ? "bg-[var(--primary-color)] text-white shadow"
                        : "text-gray-600"
                    }`}
                  >
                    Delivery
                  </button>

                  <button
                    onClick={() => setType("takeaway")}
                    className={`px-6 py-2 rounded-full text-sm font-medium ${
                      type === "takeaway"
                        ? "bg-[var(--primary-color)] text-white shadow"
                        : "text-gray-600"
                    }`}
                  >
                    Takeaway
                  </button>
                </div>

                {/* ITEMS */}
                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                          <Image
                            src={item.image || "/fallback.png"}
                            alt={item.name}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>

                        <p className="font-semibold text-sm">{item.name}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-sm">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                          <button onClick={() => decreaseQty(item.id)}>
                            <FaMinus size={10} />
                          </button>

                          <span>{item.qty}</span>

                          <button onClick={() => increaseQty(item.id)}>
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-6 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {/* BUTTON */}
                <button className="mt-6 w-full bg-[var(--primary-color)] text-white py-4 rounded-full font-semibold">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddressModal
        show={showAddress}
        onClose={() => setShowAddress(false)}
        onSave={(data) => setAddresses((prev) => [...prev, data])}
      />

      {showTimeModal && (
        <TimeModal
          onClose={() => setShowTimeModal(false)}
          onSelect={(time) => setSelectedSlot(time)}
        />
      )}
    </div>
  );
}
