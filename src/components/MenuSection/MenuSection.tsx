"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useCart } from "@/app/context/CartContext";
import { FaInfoCircle } from "react-icons/fa";
import { PiBagSimpleFill } from "react-icons/pi";
import Button from "../common/Button/Button";
import MenuSlider from "./MenuSider/MenuSlider";
import MenuItemModal from "../MenuItemModel";
import { websiteService } from "@/api/services/websiteService";
import { Category, MenuItem } from "@/types/api";
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

const MenuSection = () => {
  const { t } = useLanguage();
  const { cartItems, increaseQty, decreaseQty } = useCart();
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, itemsData] = await Promise.all([
          websiteService.getCategories(),
          websiteService.getMenuItems({ limit: 1000 }), // Retrieve the full menu items list
        ]);

        setCategories([{ id: "all", name: t("ourMenu"), isActive: true }, ...categoriesData]);
        setMenuItems(itemsData);
      } catch (err) {
        console.error("Failed to load menu data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  // Filter menu items dynamically by selected category
  const categoryItems =
    activeCategoryId === "all"
      ? menuItems
      : menuItems.filter((item) => String(item.categoryId) === String(activeCategoryId));

  // "All" shows only the top 4 priority items; a selected category shows all of its items
  const filteredItems =
    activeCategoryId === "all" ? categoryItems.slice(0, 4) : categoryItems;

  const activeCategoryName =
    activeCategoryId === "all"
      ? t("ourMenu")
      : categories.find((cat) => String(cat.id) === String(activeCategoryId))?.name || t("ourMenu");

  return (
    <section className="py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black">{t("ourMenu")}</h2>

          <Button link="/menu" type="outline">
            {t("viewAll")}
          </Button>
        </div>

        <MenuSlider
          activeCategoryId={activeCategoryId}
          onCategoryClick={(id) => setActiveCategoryId(id)}
        />

        {/* Render selected category items inside this section */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-3">
            <h3 className="text-xl md:text-2xl font-black text-gray-800">{activeCategoryName}</h3>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              {filteredItems.length} {filteredItems.length === 1 ? "Dish" : "Dishes"} available
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-center">Loading menu...</div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredItems.map((item) => {
                const cartItem = cartItems.find((i) => i.id === item.id);
                const { finalPrice, hasDiscount } = getPriceDetails(item.price, item.offer);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
                  >
                    <div className="relative w-full h-44 bg-gray-50 overflow-hidden">
                      <img
                        src={getCleanImageUrl(item.images?.[0])}
                        alt={item.name}
                        className="object-cover w-full h-full absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      />
                      {item.offer && (
                        <span className="absolute top-3 left-3 z-10 text-[9px] font-black text-white bg-green-600 px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                          {item.offer}
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex flex-col grow">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-bold text-gray-800 text-base leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="text-gray-400 hover:text-[var(--primary-color)] p-1 rounded-full hover:bg-orange-50/50 transition-colors flex-shrink-0 cursor-pointer"
                        >
                          <FaInfoCircle size={15} />
                        </button>
                      </div>

                      <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center mt-auto">
                        <div className="flex flex-col">
                          {hasDiscount ? (
                            <>
                              <span className="text-[10px] text-gray-400 line-through leading-none mb-1">
                                €{getPriceWithVat(item.price, item.vatRate, item.priceWithVat).toFixed(2)}
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
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <p className="text-sm text-gray-400">No dishes available in this category.</p>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
};

export default MenuSection;
