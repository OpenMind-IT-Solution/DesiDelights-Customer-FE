"use client";

import Image from "next/image";
import "swiper/css";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import { useState, useEffect } from "react";
import { websiteService } from "@/api/services/websiteService";
import { Category } from "@/types/api";

const MenuSlider = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await websiteService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="py-4 text-center">Loading categories...</div>;
  }

  return (
    <div className="w-full py-4">
      <Swiper
        modules={[FreeMode]}
        spaceBetween={10}
        slidesPerView={9.5}
        freeMode={true}
        grabCursor={true}
        className="cursor-grab"
      >
        {categories.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="bg-gray-100 hover:bg-(--primary-color) hover:text-white transition-all duration-200 rounded-xl py-3 px-5 flex flex-col justify-center items-center gap-2 min-w-22.5 cursor-pointer">
              <p className="text-sm font-medium text-center">
                {item.name}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MenuSlider;
