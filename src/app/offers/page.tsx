"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import { FaTag, FaUtensils, FaGift, FaCopy, FaCheck, FaSpinner, FaInfoCircle } from "react-icons/fa";
import { PiBagSimpleFill } from "react-icons/pi";
import Button from "@/components/common/Button/Button";
import MenuItemModal from "@/components/MenuItemModel";
import { websiteService } from "@/api/services/websiteService";
import { MenuItem } from "@/types/api";
import { getCleanImageUrl } from "@/utils/image";

// Helper utility to calculate discounted prices on the fly
const getPriceDetails = (price: number, offer?: string) => {
  if (!offer) return { originalPrice: price, finalPrice: price, hasDiscount: false };
  
  const percentMatch = offer.match(/(\d+)%\s*OFF/i);
  if (percentMatch) {
    const percent = parseInt(percentMatch[1], 10);
    const finalPrice = price * (1 - percent / 100);
    return { originalPrice: price, finalPrice, hasDiscount: true };
  }
  
  return { originalPrice: price, finalPrice: price, hasDiscount: false };
};

interface Coupon {
  id: number;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  startDate: string;
  expiryDate: string;
  maxUsage: number;
  status: boolean;
}

export default function OffersPage() {
  const { t } = useLanguage();
  const { cartItems, increaseQty, decreaseQty } = useCart();
  
  const [activeTab, setActiveTab] = useState<"coupons" | "deals">("coupons");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [promoItems, setPromoItems] = useState<MenuItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Fetch Coupons and Promo Items
  useEffect(() => {
    const fetchOffersData = async () => {
      try {
        setLoading(true);
        // Fetch coupons
        const fetchedCoupons = await websiteService.getCoupons();
        setCoupons(fetchedCoupons || []);

        // Fetch menu items and filter for active offers
        const fetchedItems = await websiteService.getMenuItems();
        const discountItems = (fetchedItems || []).filter((item: MenuItem) => {
          if (!item.offer) return false;
          const { hasDiscount } = getPriceDetails(item.price, item.offer);
          return hasDiscount;
        });
        setPromoItems(discountItems);
      } catch (error) {
        console.error("Failed to load offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersData();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16 px-4 md:px-8 text-center relative overflow-hidden shadow-sm">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Vibrant Deals & Savings Hub</h1>
          <p className="text-orange-50 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Discover exclusive promo coupons and special dining deals cooked just for you.
          </p>
        </div>
        <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
      </div>

      {/* Interactive Switcher Tabs */}
      <div className="flex justify-center my-10 px-4">
        <div className="bg-white p-1.5 rounded-full flex gap-1 w-full max-w-md shadow-md border border-gray-100">
          <button
            onClick={() => setActiveTab("coupons")}
            className={`flex-1 py-3 px-6 rounded-full text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "coupons"
                ? "bg-[var(--primary-color)] text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FaTag size={12} className={activeTab === "coupons" ? "rotate-90 text-white" : "text-gray-400"} />
            Coupon Codes
          </button>
          <button
            onClick={() => setActiveTab("deals")}
            className={`flex-1 py-3 px-6 rounded-full text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "deals"
                ? "bg-[var(--primary-color)] text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FaUtensils size={12} className={activeTab === "deals" ? "text-white" : "text-gray-400"} />
            Special Dining Deals
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
        {loading ? (
          /* Premium Spinner loader */
          <div className="w-full flex flex-col items-center justify-center py-24 gap-3">
            <FaSpinner size={32} className="text-[var(--primary-color)] animate-spin" />
            <span className="text-sm font-bold text-gray-500 tracking-wide">Cooking up exclusive offers...</span>
          </div>
        ) : activeTab === "coupons" ? (
          /* 1. Coupon Grid Tab */
          coupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100 flex flex-col sm:flex-row relative group"
                >
                  {/* Left Ticket Cutout Portion (Discount Value) */}
                  <div className="bg-orange-50/40 p-6 sm:p-8 flex flex-col items-center justify-center border-r-2 border-dashed border-orange-200 relative min-w-[170px]">
                    {/* Ticket circle punch mockups */}
                    <div className="hidden sm:block absolute -top-3 -right-3 w-6 h-6 bg-[#f8f9fa] rounded-full border border-orange-100"></div>
                    <div className="hidden sm:block absolute -bottom-3 -right-3 w-6 h-6 bg-[#f8f9fa] rounded-full border border-orange-100"></div>

                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[var(--primary-color)] mb-3">
                      <FaGift size={20} className="group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-3xl font-black text-gray-800 tracking-tight">
                      {coupon.type === "percentage" ? `${Math.round(coupon.discount)}%` : `€${coupon.discount}`}
                    </span>
                    <span className="text-[10px] font-black text-[var(--primary-color)] uppercase tracking-widest mt-1">
                      SAVINGS
                    </span>
                  </div>

                  {/* Right Portion (Code and Details) */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black text-green-700 bg-green-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Active Code
                      </span>
                      <h3 className="text-lg font-black text-gray-800 mt-2">
                        Enjoy {coupon.type === "percentage" ? `${coupon.discount}% off` : `€${coupon.discount} off`} your entire order!
                      </h3>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                        Use this coupon at the checkout page to validate and deduct the savings immediately.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-3.5 py-1.5 rounded-lg border border-gray-200">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer ${
                            copiedCode === coupon.code
                              ? "bg-green-600 text-white"
                              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {copiedCode === coupon.code ? (
                            <>
                              <FaCheck size={10} /> Copied!
                            </>
                          ) : (
                            <>
                              <FaCopy size={10} /> Copy
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-[10px] font-semibold text-gray-400">
                        Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
              <FaTag size={48} className="text-gray-300 mb-4 rotate-90" />
              <h3 className="font-extrabold text-gray-800 text-lg">No Active Coupons</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                We don't have any active checkout coupons at this moment. Please check back later or browse menu deals!
              </p>
            </div>
          )
        ) : (
          /* 2. Menu Deals Grid Tab */
          promoItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {promoItems.map((item) => {
                const cartItem = cartItems.find((i) => i.id === item.id);
                const { originalPrice, finalPrice, hasDiscount } = getPriceDetails(item.price, item.offer);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative w-full h-40 bg-gray-100">
                      <img
                        src={getCleanImageUrl(item.image)}
                        alt={item.name}
                        className="object-cover w-full h-full absolute inset-0"
                      />
                      {hasDiscount && (
                        <span className="absolute top-3 left-3 z-10 text-[9px] font-black text-white bg-green-600 px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                          {item.offer}
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex flex-col grow">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 line-clamp-1">{item.name}</h3>
                        <FaInfoCircle
                          onClick={() => setSelectedItem(item)}
                          className="cursor-pointer text-gray-400 hover:text-[var(--primary-color)] transition-colors"
                        />
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 mt-1">
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex flex-col">
                          {hasDiscount ? (
                            <>
                              <span className="text-[10px] text-gray-400 line-through leading-none mb-1">
                                €{originalPrice.toFixed(2)}
                              </span>
                              <span className="text-[var(--primary-color)] font-extrabold text-sm leading-none">
                                €{finalPrice.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-[var(--primary-color)] font-extrabold text-sm leading-none">
                              €{item.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {cartItem ? (
                          <div className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                            <button onClick={() => decreaseQty(item.id)} className="hover:scale-110 transition-transform px-1">-</button>
                            <span>{cartItem.qty}</span>
                            <button onClick={() => increaseQty(item.id)} className="hover:scale-110 transition-transform px-1">+</button>
                          </div>
                        ) : (
                          <Button onClick={() => setSelectedItem(item)} className="!py-1.5 !px-3.5 text-xs font-bold rounded-full">
                            <PiBagSimpleFill /> Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
              <FaUtensils size={48} className="text-gray-300 mb-4" />
              <h3 className="font-extrabold text-gray-800 text-lg">No Active Deals</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                There are no direct item promo discounts active at the moment. Browse our full menu to check other masterpieces!
              </p>
            </div>
          )
        )}
      </div>

      {/* Render the details & add to cart modal */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
