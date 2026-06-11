"use client";

import { useState, useEffect } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FaLock, FaTimes } from "react-icons/fa";

interface PaymentModalProps {
  clientSecret: string;
  publishableKey: string;
  orderTotal: number;
  currency: string;
  onSuccess: () => void;
  onClose: () => void;
  onPaymentFailed: (message: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#374151",
      fontFamily: "'Inter', sans-serif",
      "::placeholder": { color: "#9CA3AF" },
    },
    invalid: { color: "#EF4444" },
  },
};

function CheckoutForm({
  clientSecret,
  orderTotal,
  currency,
  onSuccess,
  onClose,
  onPaymentFailed,
}: Omit<PaymentModalProps, "publishableKey">) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (error) {
      setProcessing(false);
      onPaymentFailed(error.message || "Payment failed. Please try again.");
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess();
    }
  };

  const currencySymbol = currency === "eur" ? "€" : currency === "usd" ? "$" : currency.toUpperCase();

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Card Details
        </label>
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 focus-within:border-[#FA664D] transition">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <div className="flex items-center gap-1 text-gray-400 text-xs">
        <FaLock size={10} />
        <span>Your payment is secured by Stripe. We never store card details.</span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="flex-1 py-3 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 py-3 rounded-full bg-[#FA664D] text-white font-bold text-sm shadow hover:opacity-90 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {processing ? "Processing..." : `Pay ${currencySymbol}${orderTotal.toFixed(2)}`}
        </button>
      </div>

      {/* Stripe test card hint */}
      {/* <p className="text-center text-[10px] text-gray-400">
        Test: 4242 4242 4242 4242 · any future date · any CVC
      </p> */}
    </form>
  );
}

export default function PaymentModal({
  clientSecret,
  publishableKey,
  orderTotal,
  currency,
  onSuccess,
  onClose,
  onPaymentFailed,
}: PaymentModalProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    // Load Stripe dynamically using the publishable key fetched from the backend
    setStripePromise(loadStripe(publishableKey));
  }, [publishableKey]);

  if (!stripePromise) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes size={18} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-extrabold text-gray-800">Complete Payment</h2>
          <p className="text-gray-400 text-sm mt-1">
            Total: {currency === "eur" ? "€" : currency.toUpperCase()}
            {orderTotal.toFixed(2)}
          </p>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            clientSecret={clientSecret}
            orderTotal={orderTotal}
            currency={currency}
            onSuccess={onSuccess}
            onClose={onClose}
            onPaymentFailed={onPaymentFailed}
          />
        </Elements>
      </div>
    </div>
  );
}
