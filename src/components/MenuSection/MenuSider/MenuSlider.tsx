"use client";

import "swiper/css";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { websiteService } from "@/api/services/websiteService";
import { Category } from "@/types/api";

interface MenuSliderProps {
  activeCategoryId?: string;
  onCategoryClick?: (id: string) => void;
}

const MenuSlider = ({ activeCategoryId, onCategoryClick }: MenuSliderProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await websiteService.getCategories();
        setCategories([{ id: "all", name: "All", isActive: true } as any, ...data]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (id: string) => {
    if (onCategoryClick) {
      onCategoryClick(id);
    } else {
      router.push(`/menu?category=${id}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center gap-2 py-6">
        <div className="w-5 h-5 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-gray-500">Loading food categories...</span>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        grabCursor={true}
        slidesPerView="auto"
        spaceBetween={12}
        className="cursor-grab !py-2"
      >
        {categories.map((item) => {
          const isActive = activeCategoryId !== undefined && String(activeCategoryId) === String(item.id);
          return (
            <SwiperSlide key={item.id} className="!w-auto">
              <div
                onClick={() => handleCategorySelect(item.id)}
                className={`flex items-center justify-center px-4.5 py-2 h-9 sm:h-11 rounded-full cursor-pointer select-none transition-all duration-300 group text-center border shadow-sm whitespace-nowrap ${
                  isActive
                    ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)] shadow-md shadow-orange-500/10 scale-[1.02]"
                    : "bg-white hover:bg-orange-50/40 text-gray-700 hover:text-[var(--primary-color)] border-gray-100 hover:border-orange-100"
                }`}
              >
                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${isActive ? "text-white" : "text-gray-600 group-hover:text-[var(--primary-color)]"}`}>
                  {item.name}
                </span>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MenuSlider;
