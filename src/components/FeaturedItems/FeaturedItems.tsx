"use client";

import {useLanguage} from "@/app/context/LanguageContext";
import {useCart} from "@/app/context/CartContext";
import Image from "next/image";
import {FaInfoCircle} from "react-icons/fa";
import {PiBagSimpleFill} from "react-icons/pi";
import Button from "../common/Button/Button";
import { useState, useEffect } from "react";
import MenuItemModal from "../MenuItemModel";
import { websiteService } from "@/api/services/websiteService";
import { MenuItem } from "@/types/api";
import { getCleanImageUrl } from "@/utils/image";

const DEFAULT_VAT_RATE = 12;

const getPriceWithVat = (price: number, vatRate?: number, priceWithVat?: number): number => {
  return priceWithVat ?? price * (1 + (vatRate ?? DEFAULT_VAT_RATE) / 100);
};

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

interface FeaturedItemsProps {
  categoryId?: string;
  title?: string;
  hideTitle?: boolean;
  limit?: number;
  compact?: boolean;
}

const FeaturedItems = ({ categoryId = "all", title, hideTitle = false, limit, compact = false }: FeaturedItemsProps) => {
  const {t} = useLanguage();
  const {cartItems, increaseQty, decreaseQty} = useCart();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await websiteService.getMenuItems();
        setFeaturedItems(data);
      } catch (error) {
        console.error("Failed to fetch featured items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <div className="py-10 text-center">Loading featured items...</div>;
  }

  const filteredItems = categoryId && categoryId !== "all"
    ? featuredItems.filter((item) => String(item.categoryId) === String(categoryId))
    : featuredItems;

  const displayItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  const content = (
    <>
      {!hideTitle && (
        <h2 className="text-3xl font-black mb-8">{title || t("featuredItems")}</h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayItems.map((item) => {
            const cartItem = cartItems.find((i) => i.id === item.id);
            const { originalPrice, finalPrice, hasDiscount } = getPriceDetails(item.price, item.offer);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative w-full h-40 bg-gray-100">
                  <img
                    src={getCleanImageUrl(item.images?.[0])}
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
                            €{getPriceWithVat(originalPrice, item.vatRate, item.priceWithVat).toFixed(2)}
                          </span>
                          <span className="text-[var(--primary-color)] font-extrabold text-sm leading-none">
                            €{getPriceWithVat(finalPrice, item.vatRate).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-[var(--primary-color)] font-extrabold text-sm leading-none">
                          €{getPriceWithVat(item.price, item.vatRate, item.priceWithVat).toFixed(2)}
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

        {selectedItem && (
          <MenuItemModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
    </>
  );

  if (compact) return content;

  return (
    <section className="pt-0 pb-10 md:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
        {content}
      </div>
    </section>
  );
};

export default FeaturedItems;

