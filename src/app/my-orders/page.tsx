"use client";

import {useRouter} from "next/navigation";
import {FiShoppingBag} from "react-icons/fi";

const activeOrders = [
  {
    id: "#0204264",
    type: "Delivery",
    total: 6.5,
    status: "Out For Delivery",
    time: "07:01 PM, 02-04-2026",
  },
  {
    id: "#0204266",
    type: "Dining Table",
    total: 8.5,
    status: "Accepted",
    time: "07:01 PM, 02-04-2026",
  },
  {
    id: "#0204268",
    type: "Delivery",
    total: 23.38,
    status: "Preparing",
    time: "07:01 PM, 02-04-2026",
  },
];

const previousOrders = [
  {
    id: "#0204267",
    type: "Delivery",
    total: 24.09,
    status: "Completed",
    time: "07:01 PM, 02-04-2026",
  },
  {
    id: "#0204269",
    type: "Takeaway",
    total: 8.5,
    status: "Completed",
    time: "07:01 PM, 02-04-2026",
  },
];

export default function OrdersPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-gray-50 px-8 lg:px-16 py-6">
      {/* BACK */}
      <button
        onClick={() => router.push("/")}
        className="text-pink-500 mb-6 text-sm font-medium hover:underline"
      >
        ← Back to Home
      </button>

      {/* 🔥 MAIN FLEX (FORCE SIDE BY SIDE) */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold text-teal-600 mb-6">
            Active Orders
          </h2>

          <div className="space-y-5">
            {activeOrders.map((order, i) => (
              <OrderCard key={i} order={order} active />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold text-teal-600 mb-6">
            Previous Orders
          </h2>

          <div className="space-y-5">
            {previousOrders.map((order, i) => (
              <OrderCard key={i} order={order} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function OrderCard({order, active}: any) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 p-5 flex justify-between items-center">
      {/* LEFT */}
      <div className="flex gap-4 items-center">
        <div className="text-2xl text-teal-500">
          <FiShoppingBag />
        </div>

        <div>
          <p className="text-sm text-gray-500">Order ID: {order.id}</p>

          <p className="text-xs text-gray-400">{order.time}</p>

          <p className="text-sm text-blue-600 font-medium mt-1">{order.type}</p>

          <p className="font-semibold text-gray-800 mt-1">
            Total: ${order.total}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-right">
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            order.status === "Completed"
              ? "bg-purple-100 text-purple-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {order.status}
        </span>

        <button className="mt-3 px-4 py-1 text-sm rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition active:scale-95">
          {active ? "See Details" : "Reorder"}
        </button>
      </div>
    </div>
  );
}
