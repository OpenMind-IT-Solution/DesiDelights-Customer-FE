"use client";

import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { getCleanImageUrl } from "@/utils/image";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaTag,
  FaGift,
} from "react-icons/fa";
import AddressModal from "@/components/AddressModal";
import TimeModal from "@/components/TimeModal";
import CouponModal from "@/components/CouponModal";
import PaymentModal from "@/components/PaymentModal";
import { customerService } from "@/api/services/customerService";
import { websiteService } from "@/api/services/websiteService";
import { orderService } from "@/api/services/orderService";
import { paymentService } from "@/api/services/paymentService";
import Link from "next/link";

const RESTAURANT_ID = 1;

interface Address {
  id?: string;
  lat: number;
  lng: number;
  label: string;
  address: string;
}

interface PaymentStep {
  clientSecret: string;
  publishableKey: string;
  orderId: number;
  orderTotal: number;
  currency: string;
}

export default function CheckoutPage() {
  const { cartItems, increaseQty, decreaseQty, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

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
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null,
  );
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>("");

  // CHECKOUT STATE
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  // PAYMENT GATEWAY
  const [paymentGatewayEnabled, setPaymentGatewayEnabled] = useState(false);
  const [paymentCurrency, setPaymentCurrency] = useState("eur");
  const [paymentStep, setPaymentStep] = useState<PaymentStep | null>(null);

  // Fetch addresses + payment config on load
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
    fetchPaymentConfig();
  }, [isAuthenticated]);

  const fetchPaymentConfig = async () => {
    try {
      const config = await paymentService.getConfig(RESTAURANT_ID);
      setPaymentGatewayEnabled(config.enabled);
      if (config.currency) setPaymentCurrency(config.currency);
    } catch {
      // gateway not configured — fall back to direct order
      setPaymentGatewayEnabled(false);
    }
  };

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

  const handleDeleteAddress = async (
    e: React.MouseEvent,
    id: string | undefined,
  ) => {
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

  const originalSubtotal = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.qty,
    0,
  );

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const itemDiscount = originalSubtotal - subtotal;
  const deliveryCharge = orderType === "delivery" ? (subtotal > 30 ? 0 : 2) : 0;
  const total = subtotal - couponDiscount + deliveryCharge;

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

  // Step 1: Place the order — get back the orderId
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

      const selectedAddress =
        orderType === "delivery"
          ? addresses[selectedIndex]?.address
          : "Takeaway";
      const formattedTime =
        deliveryTime === "now"
          ? null
          : `${selectedDay === "tomorrow" ? "Tomorrow" : "Today"} ${selectedTime}`;

      const payload = {
        restaurantId: RESTAURANT_ID,
        orderType,
        deliveryAddress: selectedAddress,
        deliveryTime: formattedTime || undefined,
        couponCode: appliedCouponCode || undefined,
        items: cartItems.map((item) => ({
          menuItemId: Number(item.id),
          quantity: item.qty,
        })),
      };

      const order = await orderService.placeOrder(payload);

      if (paymentGatewayEnabled) {
        const intent = await paymentService.createIntent(order.id);
        setPaymentStep({
          clientSecret: intent.clientSecret,
          publishableKey: intent.publishableKey,
          orderId: order.id,
          orderTotal: parseFloat(order.totalAmount),
          currency: paymentCurrency,
        });
      } else {
        setSuccessOrder(order);
        clearCart();
      }
    } catch (err: any) {
      console.error("Checkout failed:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to place order. Please try again.";
      setCheckoutError(msg);
    } finally {
      setPlacingOrder(false);
    }
  };

  // Called after Stripe card payment succeeds on the client side
  const handlePaymentSuccess = async () => {
    if (!paymentStep) return;

    setPlacingOrder(true);

    // Poll up to 15 seconds for the webhook to mark the order as paid
    let attempts = 0;
    while (attempts < 15) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const order = await orderService.getOrderById(paymentStep.orderId);
        if (order?.paymentStatus === "paid") {
          setSuccessOrder(order);
          clearCart();
          setPaymentStep(null);
          setPlacingOrder(false);
          return;
        }
      } catch {
        // ignore transient errors during polling
      }
      attempts++;
    }

    // Webhook did not confirm — payment may still be processing on Stripe's side
    setPlacingOrder(false);
    setPaymentStep(null);
    setCheckoutError(
      "Payment was processed by Stripe, but your order confirmation is taking longer than expected. " +
      "Your order has been saved — please check your order history in a few moments."
    );
  };

  // Success Confirmation Screen
  if (successOrder) {
    return (
      <div className="bg-[#f5f6f8] min-h-screen py-16 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-lg text-center border border-gray-100">
          <div className="flex justify-center mb-6">
            <FaCheckCircle className="text-green-500" size={72} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 mb-6">
            Thank you for your order! Your delicious meal is on its way.
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3">
            <div className="flex justify-between border-b pb-2 text-sm text-gray-600">
              <span>Order ID</span>
              <span className="font-bold text-gray-800">
                #{successOrder.id}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>
                €{parseFloat(successOrder.subtotal || 0).toFixed(2)}
              </span>
            </div>
            {parseFloat(successOrder.itemDiscount) > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-semibold">
                <span>Discount (Promo)</span>
                <span>-€{parseFloat(successOrder.itemDiscount).toFixed(2)}</span>
              </div>
            )}
            {parseFloat(successOrder.discount) > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-semibold">
                <span>Discount (Coupon)</span>
                <span>-€{parseFloat(successOrder.discount).toFixed(2)}</span>
              </div>
            )}
            {orderType !== "pickup" && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Charge</span>
                <span>
                  {parseFloat(successOrder.deliveryCharge) === 0 ? (
                    <span className="text-green-600 font-bold">FREE</span>
                  ) : (
                    `€${parseFloat(successOrder.deliveryCharge || 0).toFixed(2)}`
                  )}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t font-bold text-lg text-gray-800">
              <span>Grand Total</span>
              <span className="text-[#FA664D] font-extrabold">
                €{parseFloat(successOrder.totalAmount).toFixed(2)}
              </span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Not Logged In Warning */}
        {!isAuthenticated && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-8 text-center max-w-xl mx-auto">
            <h2 className="text-lg font-bold text-orange-800 mb-2">
              Login Required
            </h2>
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
                <h2 className="font-semibold text-lg mb-4">
                  How do you want your order?
                </h2>
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

              {/* DELIVERY ADDRESS */}
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
                    <p className="text-gray-400 text-sm py-2">
                      Loading addresses...
                    </p>
                  ) : addresses.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4">
                      No address added yet. Please add a location for delivery.
                    </p>
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

                          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                            {item.address}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TIMEFRAME SELECTOR */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-lg mb-4">
                  Preferred Time Frame For{" "}
                  {orderType === "delivery" ? "Delivery" : "Takeout"}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setDeliveryTime("now")}
                    className={`p-5 rounded-xl border cursor-pointer ${
                      deliveryTime === "now" ? "border-[#FA664D] bg-[#FA664D]/5" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between">
                      <p className="font-semibold">Now</p>
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          deliveryTime === "now" ? "bg-[#FA664D] border-[#FA664D]" : "border-gray-300"
                        }`}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Ready in 30 minutes
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setDeliveryTime("schedule");
                      setShowTimeModal(true);
                    }}
                    className={`p-5 rounded-xl border cursor-pointer ${
                      deliveryTime === "schedule" ? "border-[#FA664D] bg-[#FA664D]/5" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between">
                      <p className="font-semibold">Schedule for later</p>
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          deliveryTime === "schedule" ? "bg-[#FA664D] border-[#FA664D]" : "border-gray-300"
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

              {/* PAYMENT METHOD INFO */}
              {paymentGatewayEnabled && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-semibold text-lg mb-2">Payment</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="bg-[#635BFF] text-white text-xs font-bold px-2 py-0.5 rounded">stripe</span>
                    <span>Credit / Debit Card — secured checkout</span>
                  </div>
                </div>
              )}
            </div>

            {/* CART & CALCULATION SUMMARY */}
            <div className="bg-white rounded-2xl p-6 shadow-md h-fit">
              <h2 className="font-semibold text-lg mb-5">Cart Summary</h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm mb-4">
                    Your cart is empty.
                  </p>
                  <Link href="/" className="text-[#FA664D] font-bold text-sm">
                    Browse delicious menu items
                  </Link>
                </div>
              ) : (
                <>
                  <div className="max-h-[220px] overflow-y-auto pr-1 space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center pb-2 border-b border-gray-50"
                      >
                        <div className="flex gap-3 items-center">
                          <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={getCleanImageUrl(item.image)}
                              alt={item.name}
                              className="object-cover w-full h-full absolute inset-0"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800 line-clamp-1">
                              {item.name}
                            </p>
                            <div className="flex gap-1.5 items-center flex-wrap">
                              {item.originalPrice &&
                              item.originalPrice > item.price ? (
                                <>
                                  <span className="text-[9px] text-gray-400 line-through">
                                    €{item.originalPrice.toFixed(2)}
                                  </span>
                                  <span className="text-[10px] text-[var(--primary-color)] font-bold">
                                    €{item.price.toFixed(2)} each
                                  </span>
                                  <span className="text-[8px] font-black text-green-700 bg-green-100/50 px-1.5 py-0.5 rounded-md tracking-wider">
                                    {Math.round(
                                      ((item.originalPrice - item.price) /
                                        item.originalPrice) *
                                        100,
                                    )}
                                    % OFF
                                  </span>
                                </>
                              ) : (
                                <span className="text-[10px] text-gray-400">€{item.price.toFixed(2)} each</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center bg-gray-100 rounded-full px-1.5 h-8 min-w-[90px] justify-between">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition"
                          >
                            <FaMinus size={8} />
                          </button>
                          <span className="font-bold text-xs text-gray-700 w-4 text-center">{item.qty}</span>
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
                    className={`border rounded-2xl p-4 flex justify-between items-center cursor-pointer transition mb-6 ${
                      appliedCouponCode
                        ? "bg-green-50/30 border-green-200 hover:bg-green-50/50"
                        : "bg-gray-50 border border-gray-100 hover:bg-gray-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl flex items-center justify-center">
                        {appliedCouponCode ? (
                          <FaGift
                            className="text-green-600 animate-bounce"
                            size={20}
                          />
                        ) : (
                          <FaTag
                            className="text-gray-400 rotate-90"
                            size={20}
                          />
                        )}
                      </span>
                      <div>
                        <p
                          className={`text-xs font-extrabold ${appliedCouponCode ? "text-green-800" : "text-gray-700"}`}
                        >
                          {appliedCouponCode
                            ? `Coupon Applied: ${appliedCouponCode}`
                            : "Select Offer / Apply Coupon"}
                        </p>
                        <p
                          className={`text-[10px] ${appliedCouponCode ? "text-green-600 font-semibold" : "text-gray-400"}`}
                        >
                          {appliedCouponCode
                            ? `You saved €${couponDiscount.toFixed(2)} on your order!`
                            : "Unlock discounts with your order"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {appliedCouponCode && (
                        <span className="text-[10px] font-black uppercase bg-green-200 text-green-800 px-2.5 py-1 rounded-md tracking-wider">
                          SAVED €{couponDiscount.toFixed(2)}
                        </span>
                      )}
                      <span className="text-[#FA664D] font-bold">›</span>
                    </div>
                  </div>

                  {couponError && (
                    <p className="text-red-500 text-xs mb-4 ml-1 font-semibold">
                      {couponError}
                    </p>
                  )}

                  {/* Billing calculations */}
                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-800">
                        €{originalSubtotal.toFixed(2)}
                      </span>
                    </div>
                    {itemDiscount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Discount (Promo)</span>
                        <span>-€{itemDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600 font-semibold">
                        <span>Discount ({appliedCouponCode})</span>
                        <span>-€{couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      {orderType === "pickup" ? (
                        <span className="text-green-600 font-bold">FREE TAKEOUT</span>
                      ) : deliveryCharge === 0 ? (
                        <span className="text-green-600 font-bold">FREE DELIVERY</span>
                      ) : (
                        <span className="font-semibold text-gray-800">€{deliveryCharge.toFixed(2)}</span>
                      )}
                    </div>
                    {orderType === "delivery" && subtotal <= 30 && (
                      <p className="text-[10px] text-gray-400 text-right italic font-medium">
                        Add €{(30 - subtotal).toFixed(2)} more for free delivery!
                      </p>
                    )}
                    <hr className="border-gray-100" />
                    <div className="flex justify-between font-bold text-base text-gray-800 pt-1">
                      <span>Total Amount</span>
                      <span className="text-[#FA664D] font-extrabold">
                        €{total.toFixed(2)}
                      </span>
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
                    {placingOrder
                      ? "Placing Order..."
                      : paymentGatewayEnabled
                      ? "Place Order & Pay"
                      : "Place Order"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirming payment overlay — shown while polling webhook */}
      {placingOrder && !paymentStep && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-10 h-10 border-4 border-[#FA664D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-bold text-gray-800">Confirming your order…</p>
            <p className="text-sm text-gray-500 mt-1">Please wait while we verify your payment.</p>
          </div>
        </div>
      )}

      {/* STRIPE PAYMENT MODAL */}
      {paymentStep && (
        <PaymentModal
          clientSecret={paymentStep.clientSecret}
          publishableKey={paymentStep.publishableKey}
          orderTotal={paymentStep.orderTotal}
          currency={paymentStep.currency}
          onSuccess={handlePaymentSuccess}
          onPaymentFailed={async (message) => {
            // Card was declined — cancel the order immediately
            try {
              await orderService.cancelOrder(paymentStep.orderId);
            } catch {
              // best-effort
            }
            setPaymentStep(null);
            setCheckoutError(message || "Payment failed. Please try again.");
          }}
          onClose={async () => {
            // User dismissed modal — cancel the pending order
            try {
              await orderService.cancelOrder(paymentStep.orderId);
            } catch {
              // best-effort
            }
            setPaymentStep(null);
          }}
        />
      )}

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
