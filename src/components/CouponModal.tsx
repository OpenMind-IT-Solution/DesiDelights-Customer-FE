"use client";

import {FaTimes} from "react-icons/fa";

type Props = {
  show: boolean;
  onClose: () => void;
};

export default function CouponModal({show, onClose}: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[var(--primary-color)] transition"
        >
          <FaTimes size={16} />
        </button>

        <h2 className="text-lg font-semibold mb-5">Coupon Code</h2>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter coupon"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-[var(--primary-color)]"
          />
          <button className="bg-[var(--primary-color)] text-white px-5 rounded-full font-semibold hover:opacity-90 transition">
            Apply
          </button>
        </div>

        <h3 className="font-semibold mb-1">Offer for you</h3>
        <p className="text-sm text-gray-500 mb-4">Coupon built just for you</p>

        <div className="bg-gray-50 p-4 rounded-xl mb-3 flex justify-between items-center">
          <div>
            <span className="bg-yellow-400 px-3 py-1 text-xs rounded-full font-semibold">
              Code: fairy
            </span>
            <p className="text-sm mt-2 text-gray-600">
              Get 7% off on this order
            </p>
          </div>

          <button className="bg-[var(--primary-color)] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition">
            Apply
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
          <div>
            <span className="bg-yellow-400 px-3 py-1 text-xs rounded-full font-semibold">
              Code: shake
            </span>
            <p className="text-sm mt-2 text-gray-600">
              Get $5 off on this order
            </p>
          </div>

          <button className="bg-[var(--primary-color)] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:opacity-90 transition">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
