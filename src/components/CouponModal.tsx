"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { websiteService } from "@/api/services/websiteService";

type Props = {
  show: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
};

interface Coupon {
  id: number;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  expiryDate: string;
}

export default function CouponModal({ show, onClose, onApply }: Props) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      fetchCoupons();
      setError("");
      setManualCode("");
    }
  }, [show]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await websiteService.getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (code: string) => {
    if (!code.trim()) {
      setError("Please enter a valid coupon code.");
      return;
    }
    onApply(code.trim());
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[var(--primary-color)] transition"
        >
          <FaTimes size={16} />
        </button>

        <h2 className="text-xl font-bold mb-5">Coupon Code</h2>

        {/* Manual Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => {
              setManualCode(e.target.value);
              setError("");
            }}
            placeholder="Enter coupon code"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-[var(--primary-color)]"
          />
          <button
            onClick={() => handleApply(manualCode)}
            className="bg-[#FA664D] text-white px-5 rounded-full text-sm font-semibold hover:opacity-90 transition"
          >
            Apply
          </button>
        </div>

        {error && <p className="text-red-500 text-xs mb-4 ml-2">{error}</p>}

        <h3 className="font-semibold text-sm mb-1 text-gray-700">Offers for you</h3>
        <p className="text-xs text-gray-400 mb-4">Select an active offer to apply to your order</p>

        {/* Coupons List */}
        <div className="max-h-[250px] overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <p className="text-center text-sm text-gray-500 py-4">Loading active coupons...</p>
          ) : coupons.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-4">No active coupons available at this moment.</p>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100 hover:border-gray-200 transition"
              >
                <div>
                  <span className="bg-yellow-400/20 text-yellow-800 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider">
                    {coupon.code}
                  </span>
                  <p className="text-sm mt-2 text-gray-700 font-semibold">
                    {coupon.type === "percentage"
                      ? `Get ${coupon.discount}% off on your order`
                      : `Get $${coupon.discount.toFixed(2)} off on your order`}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => handleApply(coupon.code)}
                  className="bg-[#FA664D] text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 transition"
                >
                  Apply
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
