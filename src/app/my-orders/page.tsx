"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { orderService } from "@/api/services/orderService";
import { 
  FiShoppingBag, 
  FiClock, 
  FiMapPin, 
  FiChevronDown, 
  FiChevronUp, 
  FiCreditCard 
} from "react-icons/fi";
import { toast } from "react-toastify";

// Define TypeScript interfaces to satisfy strict type-checking
interface OrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string | null;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  restaurantId: number[];
  customerId: number;
  status: string;
  totalAmount: string;
  paymentStatus: string;
  orderType: string;
  deliveryAddress: string | null;
  deliveryTime: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Fetch user's orders (e.g. limit to last 100 orders)
      const data = await orderService.listOrders({ limit: 100 });
      if (data && data.orders) {
        setOrders(data.orders);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch orders:", err);
      const apiError = err as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || "Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  // Loading state (skeleton screens)
  if (authLoading || (isAuthenticated && loading)) {
    return (
      <div className="w-full min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 animate-pulse">
          <button
            onClick={() => router.push("/")}
            className="text-pink-500 mb-6 text-sm font-semibold hover:underline flex items-center gap-1 transition"
          >
            ← Back to Home
          </button>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-10"></div>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl w-full"></div>
              ))}
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated state
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-100 hover:shadow-2xl transition duration-300">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 text-4xl shadow-inner">
            <FiShoppingBag />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Please Login</h2>
          <p className="text-gray-500 mb-8 text-sm sm:text-base">
            You need to be logged in to view your order history and track active deliveries.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3.5 rounded-full bg-[#FA664D] text-white font-semibold hover:bg-[#e85a43] transition shadow-md hover:shadow-lg active:scale-95 duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3.5 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition active:scale-95 duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active vs Previous Order division
  const activeOrders = orders.filter((order) => {
    const status = order.status?.toLowerCase() || "";
    return ["placed", "confirmed", "preparing", "accepted", "ready", "out_for_delivery", "picked_up"].includes(status);
  });

  const previousOrders = orders.filter((order) => {
    const status = order.status?.toLowerCase() || "";
    return ["completed", "cancelled", "rejected", "failed"].includes(status);
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
        {/* BACK TO HOME */}
        <button
          onClick={() => router.push("/")}
          className="text-pink-500 mb-8 text-sm font-semibold hover:underline flex items-center gap-1 transition-all duration-200 hover:translate-x-[-4px]"
        >
          ← Back to Home
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-10 tracking-tight flex items-center gap-3">
          <span className="w-2.5 h-8 bg-teal-500 rounded-full"></span>
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-gray-100 max-w-xl mx-auto">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-500 text-3xl shadow-inner animate-bounce">
              <FiShoppingBag />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders placed yet</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Hungry? Explore our delicious menu and place your first order today!
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 rounded-full bg-[#FA664D] text-white font-semibold hover:bg-[#e85a43] transition shadow-md hover:shadow-lg active:scale-95 duration-200"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ACTIVE ORDERS */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-xl font-bold text-teal-600 mb-6 flex items-center gap-2">
                Active Orders
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                  {activeOrders.length}
                </span>
              </h2>

              <div className="space-y-6">
                {activeOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border shadow-sm text-gray-500 text-sm">
                    No active orders at the moment.
                  </div>
                ) : (
                  activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} active />
                  ))
                )}
              </div>
            </div>

            {/* PREVIOUS ORDERS */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
                Order History
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                  {previousOrders.length}
                </span>
              </h2>

              <div className="space-y-6">
                {previousOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border shadow-sm text-gray-500 text-sm">
                    No order history found.
                  </div>
                ) : (
                  previousOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function OrderCard({ order, active }: { order: Order; active?: boolean }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  // Format Status Label & Style
  const getStatusConfig = (status: string) => {
    const rawStatus = status?.toLowerCase() || "";
    switch (rawStatus) {
      case "placed":
        return { label: "Order Placed", classes: "bg-teal-50 text-teal-600 border border-teal-200" };
      case "confirmed":
        return { label: "Confirmed", classes: "bg-green-50 text-green-600 border border-green-200" };
      case "accepted":
        return { label: "Accepted", classes: "bg-blue-50 text-blue-600 border border-blue-200" };
      case "preparing":
        return { label: "Preparing", classes: "bg-orange-50 text-orange-600 border border-orange-200" };
      case "ready":
        return { label: "Ready for Pickup", classes: "bg-emerald-50 text-emerald-600 border border-emerald-200" };
      case "out_for_delivery":
        return { label: "Out For Delivery", classes: "bg-amber-50 text-amber-600 border border-amber-200" };
      case "picked_up":
        return { label: "Picked Up", classes: "bg-yellow-50 text-yellow-600 border border-yellow-200" };
      case "completed":
        return { label: "Delivered", classes: "bg-purple-50 text-purple-600 border border-purple-200" };
      case "cancelled":
        return { label: "Cancelled", classes: "bg-red-50 text-red-600 border border-red-200" };
      case "rejected":
        return { label: "Rejected", classes: "bg-red-50 text-red-600 border border-red-200" };
      case "failed":
        return { label: "Failed", classes: "bg-red-50 text-red-600 border border-red-200" };
      default:
        return { label: status || "Pending", classes: "bg-gray-50 text-gray-600 border border-gray-200" };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  // Format Date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return dateStr;
    }
  };

  // Handle reorder redirect (simply bring to homepage for now)
  const handleReorder = () => {
    toast.info("Add items to cart to place a new order!");
    router.push("/");
  };

  const total = parseFloat(order.totalAmount || "0").toFixed(2);
  const orderTypeFormatted = order.orderType === "delivery" ? "Delivery Order" : "Store Pickup / Takeaway";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden">
      {/* CARD BODY */}
      <div className="p-5 sm:p-6 flex justify-between items-center gap-4">
        {/* LEFT COMPONENT */}
        <div className="flex gap-4 items-start">
          <div className="text-2xl text-teal-500 bg-teal-50 p-3.5 rounded-xl flex items-center justify-center shadow-inner">
            <FiShoppingBag />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 tracking-wider">ORDER ID: #{order.id}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <FiClock className="text-gray-400" /> {formatDate(order.createdAt)}
            </p>
            <p className="text-sm text-blue-600 font-semibold mt-2">{orderTypeFormatted}</p>
            <p className="text-base font-extrabold text-gray-800 mt-1 flex items-center">
              Total: ${total}
            </p>
          </div>
        </div>

        {/* RIGHT COMPONENT */}
        <div className="text-right flex flex-col items-end justify-between self-stretch">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize select-none shadow-sm ${statusConfig.classes}`}>
            {statusConfig.label}
          </span>

          <div className="flex gap-2 items-center mt-4 sm:mt-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3.5 py-1.5 text-xs rounded-full border border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold transition active:scale-95 flex items-center gap-1"
            >
              {isExpanded ? (
                <>Hide Details <FiChevronUp /></>
              ) : (
                <>See Details <FiChevronDown /></>
              )}
            </button>
            {!active && (
              <button
                onClick={handleReorder}
                className="px-4 py-1.5 text-xs rounded-full bg-orange-500 text-white hover:bg-orange-600 font-semibold transition active:scale-95 shadow-sm"
              >
                Reorder
              </button>
            )}
          </div>
        </div>
      </div>

      {/* EXPANDABLE SECTION (ORDER DETAILS) */}
      <div
        className={`bg-gray-50 border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[500px] opacity-100 py-5 px-6" : "max-h-0 opacity-0 py-0 px-6"
        }`}
      >
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Items Ordered</h4>
        
        {/* ITEM LIST */}
        <div className="space-y-3 mb-5 max-h-48 overflow-y-auto pr-1">
          {order.orderItems?.map((item: OrderItem, idx: number) => {
            const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);
            return (
              <div key={item.id || idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 text-sm">
                <div>
                  <p className="font-bold text-gray-800">{item.menuItemName || `Menu Item #${item.menuItemId}`}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.quantity} x ${parseFloat(item.price).toFixed(2)}
                  </p>
                </div>
                <span className="font-extrabold text-gray-700">${itemTotal}</span>
              </div>
            );
          })}
        </div>

        {/* DELIVERY ADDRESS / SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200/60 pt-4 text-xs">
          <div>
            <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Payment Status</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold select-none text-[10px] uppercase ${
              order.paymentStatus?.toLowerCase() === "completed"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}>
              <FiCreditCard size={10} /> {order.paymentStatus || "Pending"}
            </span>
          </div>

          {order.orderType === "delivery" && order.deliveryAddress && (
            <div>
              <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">Delivery Address</span>
              <p className="text-gray-600 flex items-start gap-1 font-medium leading-relaxed">
                <FiMapPin className="text-gray-400 flex-shrink-0 mt-0.5" />
                {order.deliveryAddress}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
