"use client";

import {useCart} from "@/app/context/CartContext";
import Image from "next/image";
import { getCleanImageUrl } from "@/utils/image";
import {SetStateAction, useState} from "react";
import {FaPlus, FaMinus} from "react-icons/fa";
import AddressModal from "@/components/AddressModal";
import TimeModal from "@/components/TimeModal";
import CouponModal from "@/components/CouponModal";

export default function CheckoutPage() {
  const {cartItems, increaseQty, decreaseQty} = useCart();

  // ADDRESS
  const [addresses, setAddresses] = useState<
    {lat: number; lng: number; label: string; address: string}[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAddress, setShowAddress] = useState(false);

  // TIME
  const [deliveryTime, setDeliveryTime] = useState<"now" | "schedule">("now");

  const [showTimeModal, setShowTimeModal] = useState(false);

  // COUPON
  const [showCoupon, setShowCoupon] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow">("today");

  return (
    <div className="bg-[#f5f6f8] min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-lg">Delivery Address</h2>

                <button
                  onClick={() => setShowAddress(true)}
                  className="bg-[#FA664D]/10 text-[#FA664D] px-4 py-2 rounded-full text-sm"
                >
                  + Add
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {addresses.length === 0 && (
                  <p className="text-gray-500 text-sm">No address added yet</p>
                )}

                {addresses.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    className={`p-4 rounded-xl cursor-pointer ${
                      selectedIndex === i
                        ? "bg-[#FA664D]/10 border border-[#FA664D]"
                        : "bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold text-[#FA664D]">
                        {item.label}
                      </p>

                      <div
                        className={`w-4 h-4 rounded-full border ${
                          selectedIndex === i
                            ? "bg-[#FA664D] border-[#FA664D]"
                            : "border-gray-400"
                        }`}
                      />
                    </div>

                    <p className="text-sm text-gray-600">{item.address}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">
                Preferred Time Frame For Delivery
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setDeliveryTime("now")}
                  className={`p-5 rounded-xl border cursor-pointer ${
                    deliveryTime === "now"
                      ? "border-[#FA664D] bg-[#FA664D]/5"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between">
                    <p className="font-semibold">Now</p>

                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        deliveryTime === "now"
                          ? "bg-[#FA664D] border-[#FA664D]"
                          : "border-gray-300"
                      }`}
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-2">30 minutes</p>
                </div>

                <div
                  onClick={() => {
                    setDeliveryTime("schedule");
                    setShowTimeModal(true);
                  }}
                  className={`p-5 rounded-xl border cursor-pointer ${
                    deliveryTime === "schedule"
                      ? "border-[#FA664D] bg-[#FA664D]/5"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between">
                    <p className="font-semibold">Schedule for later</p>

                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        deliveryTime === "schedule"
                          ? "bg-[#FA664D] border-[#FA664D]"
                          : "border-gray-300"
                      }`}
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {selectedTime
                      ? `${selectedDay === "tomorrow" ? "Tomorrow" : "Today"} ${selectedTime}`
                      : "Choose a time"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="font-semibold text-lg mb-5">Cart Summary</h2>

            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-4">
                <div className="flex gap-3">
                  <div className="relative w-14 h-14 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={getCleanImageUrl(item.image)}
                      alt={item.name}
                      className="object-cover w-full h-full absolute inset-0"
                    />
                  </div>

                  <p className="text-sm font-semibold">{item.name}</p>
                </div>

                <div className="flex items-center bg-gray-100 rounded-full px-2 h-10 min-w-[110px] justify-between">
                  {/* MINUS */}
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition"
                  >
                    <FaMinus size={10} />
                  </button>

                  {/* QTY */}
                  <span className="font-semibold text-sm w-6 text-center">
                    {item.qty}
                  </span>

                  {/* PLUS */}
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white hover:opacity-90 transition"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
              </div>
            ))}

            <div
              onClick={() => setShowCoupon(true)}
              className="mt-6 bg-gray-50 rounded-xl p-4 flex justify-between cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold">
                  Select Offer/Apply Coupon
                </p>
                <p className="text-xs text-gray-500">
                  Get discount with your order
                </p>
              </div>
              <span>›</span>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span>$0.00</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="text-green-600">$0.00</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button className="mt-6 w-full bg-[#FA664D] text-white py-4 rounded-full font-semibold">
              Place Order
            </button>
          </div>
        </div>
      </div>

      <AddressModal
        show={showAddress}
        onClose={() => setShowAddress(false)}
        onSave={(data) => setAddresses((prev) => [...prev, data])}
      />

      {showTimeModal && (
        <TimeModal
          show={showTimeModal}
          onClose={() => setShowTimeModal(false)}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      )}

      <CouponModal show={showCoupon} onClose={() => setShowCoupon(false)} />
    </div>
  );
}
