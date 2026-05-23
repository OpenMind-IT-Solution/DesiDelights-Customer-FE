"use client";

import { useState, useEffect, useRef } from "react";
import { FaSearch, FaSpinner, FaUtensils } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { websiteService } from "@/api/services/websiteService";
import { MenuItem } from "@/types/api";
import { getCleanImageUrl } from "@/utils/image";
import MenuItemModal from "@/components/MenuItemModel";

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

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search API request
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const items = await websiteService.getMenuItems({ search: query, limit: 6 });
        setResults(items);
      } catch (error) {
        console.error("Failed to search menu items:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation & closing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-[240px] sm:w-[260px] md:w-[300px] lg:w-[340px]">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <span className="absolute left-4 text-gray-400">
          <FaSearch size={14} />
        </span>
        
        <input
          className="w-full rounded-full bg-gray-50 py-2.5 pl-10 pr-10 text-sm outline-none border border-gray-100 focus:border-[var(--primary-color)] focus:bg-white focus:shadow-sm transition-all duration-200"
          name="search"
          placeholder="Search for delicious food..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IoCloseOutline size={18} />
          </button>
        )}
      </div>

      {/* Dropdown Search Results */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2.5 w-full min-w-[280px] sm:min-w-[340px] md:min-w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden z-50 animate-fadeIn">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
              <FaSpinner className="animate-spin text-[var(--primary-color)]" size={24} />
              <span className="text-xs font-medium">Searching our kitchen...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50">
                Dishes Found ({results.length})
              </div>
              <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                {results.map((item) => {
                  const { originalPrice, finalPrice, hasDiscount } = getPriceDetails(item.price, item.offer);
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50/40 cursor-pointer transition-all duration-150 border-b border-gray-50/60 last:border-b-0"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img
                          src={getCleanImageUrl(item.image)}
                          alt={item.name}
                          className="object-cover w-full h-full absolute inset-0"
                        />
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm leading-tight truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex-shrink-0 text-right flex flex-col justify-center">
                        {hasDiscount ? (
                          <>
                            <span className="text-[10px] text-gray-400 line-through leading-none mb-0.5">
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
                    </div>
                  );
                })}
              </div>
            </div>
          ) : query.trim() ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <FaUtensils className="text-3xl text-gray-300 mb-2 animate-pulse" />
              <h5 className="font-semibold text-gray-700 text-sm">No items found</h5>
              <p className="text-xs text-gray-400 mt-1 max-w-[240px]">
                We couldn't find any dishes matching "{query}". Try searching for something else!
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Render the details & add to cart modal */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default SearchComponent;
