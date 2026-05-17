"use client";

import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { getCleanImageUrl } from "@/utils/image";
import { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTrash, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import AddressModal from "@/components/AddressModal";
import TimeModal from "@/components/TimeModal";
import CouponModal from "@/components/CouponModal";
import { customerService } from "@/api/services/customerService";
import { websiteService } from "@/api/services/websiteService";
import { orderService } from "@/api/services/orderService";
import Link from "next/link";

interface Address {
  id?: string;
  lat: number;
  lng: number;
  label: string;
  address: string;
}

export default function CheckoutPage() {
  const { cartItems, increaseQty, decreaseQty, clearCart } = useCart();
  const { isAuthenticated, token } = useAuth();

  // Order type: delivery vs pickup
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");

  // ADDRESS
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // TIME
  const [deliveryTime, setDeliveryTime] = useState<"now" | "schedule">("now");
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow">("today");

  // COUPON
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>("");

  // CHECKOUT STATE
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  // Fetch addresses on load if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const list = await customerService.getAddresses();
      setAddresses(list || []);
    } catch (err) {
      console.error("Failed to load addresses", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = async (data: Omit<Address, "id">) => {
    try {
      await customerService.saveAddress(data);
      await fetchAddresses();
    } catch (err) {
      console.error("Failed to save address", err);
    }
  };

  const handleDeleteAddress = async (e: React.MouseEvent, id: string | undefined) => {
    e.stopPropagation();
    if (!id) return;
    try {
      await customerService.deleteAddress(id);
      await fetchAddresses();
      if (selectedIndex >= addresses.length - 1) {
        setSelectedIndex(Math.max(0, addresses.length - 2));
      }
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Calculate dynamic values
  const deliveryCharge = orderType === "delivery" ? (subtotal > 30 ? 0 : 5) : 0;
  const total = subtotal - couponDiscount + deliveryCharge;

  // Handle Coupon Selection / Validation
  const handleApplyCoupon = async (code: string) => {
    try {
      setCouponError("");
      const result = await websiteService.validateCoupon(code, subtotal);
      setAppliedCouponCode(result.code);
      setCouponDiscount(result.discountAmount);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid coupon code.";
      setCouponError(msg);
      setAppliedCouponCode(null);
      setCouponDiscount(0);
    }
  };

  // Place Order on Backend
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    if (orderType === "delivery" && addresses.length === 0) {
      setCheckoutError("Please add a delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);
      setCheckoutError("");

      const selectedAddress = orderType === "delivery" ? addresses[selectedIndex]?.address : "Takeout";
      const formattedTime = deliveryTime === "now" ? null : `${selectedDay === "tomorrow" ? "Tomorrow" : "Today"} ${selectedTime}`;

      const payload = {
        restaurantId: 1, // Default main restaurant
        orderType,
        deliveryAddress: selectedAddress,
        deliveryTime: formattedTime,
        couponCode: appliedCouponCode || undefined,
        items: cartItems.map((item) => ({
          menuItemId: Number(item.id),
          quantity: item.qty,
        })),
      };

      const result = await orderService.placeOrder(payload);
      
      // Order placed successfully!
      setSuccessOrder(result);
      clearCart();
    } catch (err: any) {
      console.error("Checkout failed:", err);
      const msg = err.response?.data?.message || "Failed to place order. Please try again.";
      setCheckoutError(msg);
    } finally {
      setPlacingOrder(false);
    }
  };

  // Success Confirmation Screen
  if (successOrder) {
    return (
      <div className="bg-[#f5f6f8] min-h-screen py-16 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-lg text-center border border-gray-100">
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-green-500" size={72} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500 mb-6">
            Thank you for your order! Your delicious meal is on its way.
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3">
            <div className="flex justify-between border-b pb-2 text-sm text-gray-600">
              <span>Order ID</span>
              <span className="font-bold text-gray-800">#{successOrder.id}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${(successOrder.subtotal || subtotal).toFixed(2)}</span>
            </div>
            {successOrder.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-semibold">
                <span>Discount</span>
                <span>-${successOrder.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Charge</span>
              <span>${successOrder.deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-lg text-gray-800">
              <span>Grand Total</span>
              <span>${successOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block bg-[#FA664D] text-white px-8 py-3.5 rounded-full font-bold text-md shadow-md hover:opacity-90 transition w-full"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f6f8] min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Not Logged In Warning */}
        {!isAuthenticated && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8 text-center max-w-xl mx-auto">
            <h2 className="text-lg font-bold text-orange-800 mb-2">Login Required</h2>
            <p className="text-orange-700 text-sm mb-4">
              To place your order, please log in or log in as a Guest.
            </p>
            <Link
              href="/login"
              className="bg-[#FA664D] text-white px-6 py-2 rounded-full text-sm font-semibold inline-block hover:opacity-90 transition"
            >
              Go to Login
            </Link>
          </div>
        )}

        {isAuthenticated && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* ORDER TYPE SELECTOR */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-lg mb-4">How do you want your order?</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setOrderType("delivery")}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold border text-center transition ${
                      orderType === "delivery"
                        ? "bg-[#FA664D]/10 border-[#FA664D] text-[#FA664D]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    onClick={() => setOrderType("pickup")}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold border text-center transition ${
                      orderType === "pickup"
                        ? "bg-[#FA664D]/10 border-[#FA664D] text-[#FA664D]"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Takeout
                  </button>
                </div>
              </div>

              {/* DELIVERY ADDRESS - DISPLAYED ONLY FOR DELIVERY TYPE */}
              {orderType === "delivery" && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">Delivery Address</h2>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="bg-[#FA664D]/10 text-[#FA664D] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#FA664D]/20 transition"
                    >
                      + Add Address
                    </button>
                  </div>

                  {loadingAddresses ? (
                    <p className="text-gray-400 text-sm py-2">Loading addresses...</p>
                  ) : addresses.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4">No address added yet. Please add a location for delivery.</p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {addresses.map((item, i) => (
                        <div
                          key={item.id || i}
                          onClick={() => setSelectedIndex(i)}
                          className={`p-4 rounded-xl cursor-pointer relative border transition ${
                            selectedIndex === i
                              ? "bg-[#FA664D]/10 border-[#FA664D]"
                              : "bg-gray-50 border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between mb-2">
                            <span className="font-bold text-[#FA664D] text-sm uppercase flex items-center gap-1.5">
                              <FaMapMarkerAlt /> {item.label}
                            </span>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => handleDeleteAddress(e, item.id)}
                                className="text-gray-400 hover:text-red-500 transition"
                                title="Delete address"
                              >
                                <FaTrash size={12} />
                              </button>

                              <div
                                className={`w-4 h-4 rounded-full border ${
                                  selectedIndex === i
                                    ? "bg-[#FA664D] border-[#FA664D]"
                                    : "border-gray-400"
                                }`}
                              />
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-2 mt-1">{item.address}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TIMEFRAME SELECTOR */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-lg mb-4">
                  Preferred Time Frame For {orderType === "delivery" ? "Delivery" : "Takeout"}
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
                    <p className="text-sm text-gray-500 mt-2">Ready in 30 minutes</p>
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

            {/* CART & CALCULATION SUMMARY */}
            <div className="bg-white rounded-2xl p-6 shadow-md h-fit">
              <h2 className="font-semibold text-lg mb-5">Cart Summary</h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm mb-4">Your cart is empty.</p>
                  <Link href="/" className="text-[#FA664D] font-bold text-sm">
                    Browse delicious menu items
                  </Link>
                </div>
              ) : (
                <>
                  <div className="max-h-[220px] overflow-y-auto pr-1 space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center pb-2 border-b border-gray-50">
                        <div className="flex gap-3 items-center">
                          <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={getCleanImageUrl(item.image)}
                              alt={item.name}
                              className="object-cover w-full h-full absolute inset-0"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-gray-400">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>

                        <div className="flex items-center bg-gray-100 rounded-full px-1.5 h-8 min-w-[90px] justify-between">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition"
                          >
                            <FaMinus size={8} />
                          </button>
                          <span className="font-bold text-xs text-gray-700 w-4 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white hover:opacity-95 transition"
                          >
                            <FaPlus size={8} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Selector */}
                  <div
                    onClick={() => setShowCouponModal(true)}
                    className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex justify-between cursor-pointer hover:bg-gray-100/50 transition mb-6"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-700">
                        {appliedCouponCode ? `Coupon Applied: ${appliedCouponCode}` : "Select Offer/Apply Coupon"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {appliedCouponCode ? "Coupon active. Discount deducted!" : "Get discount with your order"}
                      </p>
                    </div>
                    <span className="text-[#FA664D] font-bold">›</span>
                  </div>

                  {couponError && (
                    <p className="text-red-500 text-xs mb-4 ml-1 font-semibold">{couponError}</p>
                  )}

                  {/* Backend Secured Billing calculations */}
                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Discount ({appliedCouponCode})</span>
                        <span>-${couponDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      {orderType === "pickup" ? (
                        <span className="text-green-600 font-bold">FREE TAKEOUT</span>
                      ) : deliveryCharge === 0 ? (
                        <span className="text-green-600 font-bold">FREE DELIVERY</span>
                      ) : (
                        <span className="font-semibold text-gray-800">${deliveryCharge.toFixed(2)}</span>
                      )}
                    </div>

                    {orderType === "delivery" && subtotal <= 30 && (
                      <p className="text-[10px] text-gray-400 text-right italic">Add ${(30 - subtotal).toFixed(2)} more for free delivery!</p>
                    )}

                    <hr className="border-gray-100" />

                    <div className="flex justify-between font-bold text-base text-gray-800 pt-1">
                      <span>Total Amount</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs mb-4 font-semibold text-center">
                      {checkoutError}
                    </div>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder || cartItems.length === 0}
                    className="w-full bg-[#FA664D] text-white py-4 rounded-full font-bold shadow-md hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    {placingOrder ? "Placing Order..." : "Place Order"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <AddressModal
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleAddAddress}
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

      <CouponModal
        show={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        onApply={handleApplyCoupon}
      />
    </div>
  );
}
