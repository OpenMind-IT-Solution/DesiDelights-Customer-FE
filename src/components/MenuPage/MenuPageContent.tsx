"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { useCart } from "@/app/context/CartContext";
import { FaInfoCircle, FaSearch, FaUtensils } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { PiBagSimpleFill } from "react-icons/pi";
import Button from "../common/Button/Button";
import MenuSlider from "../MenuSection/MenuSider/MenuSlider";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { websiteService } from "@/api/services/websiteService";
import { Category, MenuItem } from "@/types/api";
import { getCleanImageUrl } from "@/utils/image";
import MenuItemModal from "../MenuItemModel";

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

const MenuPageContent = () => {
  const { t } = useLanguage();
  const { cartItems, increaseQty, decreaseQty } = useCart();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [sortBy, setSortBy] = useState<string>("default");

  // Fetch categories and menu items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, itemsData] = await Promise.all([
          websiteService.getCategories(),
          websiteService.getMenuItems({ limit: 1000 }), // Retrieve the full menu items list
        ]);
        
        setCategories(categoriesData);
        setMenuItems(itemsData);
        
        // Retrieve and apply category parameter if present on initial load
        const categoryParam = searchParams.get("category");
        if (categoryParam) {
          setActiveCategoryId(categoryParam);
        } else {
          setActiveCategoryId("all");
        }
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Handle category selector changes
  const handleCategoryClick = (id: string) => {
    setActiveCategoryId(id);
  };

  // Sync URL search parameters with active filter changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setActiveCategoryId(categoryParam);
    } else {
      setActiveCategoryId("all");
    }
  }, [searchParams]);

  // Filter menu items dynamically by search query
  const searchedItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter menu items dynamically by selected category
  const finalItems = activeCategoryId === "all"
    ? searchedItems
    : searchedItems.filter((item) => String(item.categoryId) === String(activeCategoryId));

  // Sort filtered menu items dynamically
  const sortedItems = [...finalItems].sort((a, b) => {
    const getFinalPrice = (item: MenuItem) => {
      const { finalPrice } = getPriceDetails(item.price, item.offer);
      return finalPrice;
    };

    if (sortBy === "price-asc") {
      return getFinalPrice(a) - getFinalPrice(b);
    }
    if (sortBy === "price-desc") {
      return getFinalPrice(b) - getFinalPrice(a);
    }
    if (sortBy === "name-asc") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "name-desc") {
      return b.name.localeCompare(a.name);
    }
    if (sortBy === "offers") {
      const hasOfferA = a.offer ? 1 : 0;
      const hasOfferB = b.offer ? 1 : 0;
      return hasOfferB - hasOfferA; // Items with discounts/offers first
    }
    return 0; // default database order
  });

  // Determine current active filter header label
  const activeCategoryName = activeCategoryId === "all"
    ? "All Dishes"
    : categories.find((cat) => String(cat.id) === String(activeCategoryId))?.name || "Dishes";

  if (loading) {
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-base font-semibold text-gray-500 tracking-wider">Preparing our culinary wonders...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      {/* Premium Hero Header */}
      <div className="relative bg-gradient-to-r from-orange-600 to-amber-500 py-16 md:py-24 text-center text-white overflow-hidden shadow-lg shadow-orange-500/10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-sm">
            {t("ourMenu")}
          </h1>
          <p className="text-base md:text-lg text-orange-50 font-medium max-w-xl mx-auto leading-relaxed opacity-95">
            Discover a wide selection of authentic Indian dishes cooked with fresh spices and lots of love.
          </p>
        </div>
      </div>

      {/* Sticky Categories Selector & Search Bar */}
      <div className="sticky top-[84px] md:top-[120px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Box and Sort Selector */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:max-w-xl">
              {/* Search Box */}
              <div className="relative flex items-center w-full">
                <span className="absolute left-4 text-gray-400">
                  <FaSearch size={15} />
                </span>
                <input
                  type="text"
                  placeholder="Search delicious dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 focus:border-orange-300 focus:bg-white rounded-full py-2.5 pl-11 pr-10 text-sm outline-none transition-all duration-300 shadow-inner text-gray-700"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <IoCloseOutline size={20} />
                  </button>
                )}
              </div>

              {/* Sort Filter Dropdown */}
              <div className="relative flex items-center w-full sm:max-w-[200px] flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-orange-300 focus:bg-white rounded-full py-2.5 pl-4 pr-8 text-xs font-bold outline-none cursor-pointer appearance-none transition-all duration-300 text-gray-600 shadow-inner"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="offers">Offers & Discounts</option>
                </select>
                <div className="pointer-events-none absolute right-4 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Categories Slider */}
            <div className="w-full lg:max-w-3xl overflow-hidden">
              <MenuSlider
                activeCategoryId={activeCategoryId}
                onCategoryClick={handleCategoryClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Flat Structured Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 py-10 md:py-16">
        {/* Active Selection Header */}
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
              {activeCategoryName}
            </h2>
            <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-wider">
              {sortedItems.length} {sortedItems.length === 1 ? "Dish" : "Dishes"} available
            </p>
          </div>
        </div>

        {/* Dynamic Items Grid */}
        {sortedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {sortedItems.map((item) => {
              const cartItem = cartItems.find((i) => i.id === item.id);
              const { finalPrice, hasDiscount } = getPriceDetails(item.price, item.offer);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
                >
                  {/* Image & Badges */}
                  <div className="relative w-full h-48 bg-gray-50 overflow-hidden">
                    <img
                      src={getCleanImageUrl(item.image)}
                      alt={item.name}
                      className="object-cover w-full h-full absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Promotion Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {item.offer && (
                        <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl shadow-md animate-pulse">
                          {item.offer}
                        </span>
                      )}
                      {item.tag && (
                        <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl shadow-md">
                          {item.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-5 flex flex-col grow">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-gray-800 text-base leading-snug group-hover:text-[var(--primary-color)] transition-colors duration-200 line-clamp-1">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-gray-400 hover:text-[var(--primary-color)] p-1 rounded-full hover:bg-orange-50/50 transition-colors flex-shrink-0 cursor-pointer"
                      >
                        <FaInfoCircle size={17} />
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 mb-5 line-clamp-2 leading-relaxed min-h-[36px]">
                      {item.description}
                    </p>

                    {/* Price and Cart controls */}
                    <div className="flex justify-between items-center mt-auto border-t border-gray-50 pt-4">
                      <div className="flex flex-col">
                        {hasDiscount ? (
                          <>
                            <span className="text-gray-400 line-through text-[10px] font-semibold">
                              €{item.price.toFixed(2)}
                            </span>
                            <span className="text-[var(--primary-color)] font-extrabold text-lg leading-tight">
                              €{finalPrice.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-[var(--primary-color)] font-extrabold text-lg">
                            €{item.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {cartItem ? (
                        <div className="flex items-center gap-3 bg-[var(--primary-color)] text-white px-3 py-1.5 rounded-full shadow-md shadow-orange-500/15">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="font-extrabold hover:scale-125 transition-transform px-1 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-bold text-sm min-w-[12px] text-center">
                            {cartItem.qty}
                          </span>
                          <button
                            onClick={() => increaseQty(item.id)}
                            className="font-extrabold hover:scale-125 transition-transform px-1 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setSelectedItem(item)}
                          className="!py-1.5 !px-3.5 shadow-sm hover:shadow-md transition-all rounded-full flex items-center gap-1.5 text-xs font-bold"
                        >
                          <PiBagSimpleFill size={15} /> Add
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Filter State */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
            <FaUtensils className="text-5xl text-gray-300 mb-6 animate-pulse" />
            <h3 className="font-extrabold text-gray-800 text-xl mb-2">No matching dishes</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              We couldn't find any dishes under "{activeCategoryName}" matching "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategoryId("all");
                setSortBy("default");
              }}
              className="bg-[var(--primary-color)] hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-full shadow-lg shadow-orange-500/10 transition-all duration-300 text-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Details & Customizations Modal */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default MenuPageContent;
