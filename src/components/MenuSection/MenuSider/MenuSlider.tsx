"use client";

import Image from "next/image";
import "swiper/css";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

const MenuSlider = () => {
  const menuItems = [
    {
      menuImage: "/images/menu/item1.png",
      name: "Burgers",
    },
    {
      menuImage: "/images/menu/item2.png",
      name: "Sandwich from the Grill",
    },
    {
      menuImage: "/images/menu/item3.png",
      name: "Pizzas",
    },
    {
      menuImage: "/images/menu/item4.png",
      name: "Drinks",
    },
    {
      menuImage: "/images/menu/item5.png",
      name: "Desserts",
    },
    {
      menuImage: "/images/menu/item1.png",
      name: "Burgers",
    },
    {
      menuImage: "/images/menu/item2.png",
      name: "Sandwich from the Grill",
    },
    {
      menuImage: "/images/menu/item3.png",
      name: "Pizzas",
    },
    {
      menuImage: "/images/menu/item4.png",
      name: "Drinks",
    },
    {
      menuImage: "/images/menu/item5.png",
      name: "Desserts",
    },
    {
      menuImage: "/images/menu/item1.png",
      name: "Burgers",
    },
    {
      menuImage: "/images/menu/item2.png",
      name: "Sandwich from the Grill",
    },
    {
      menuImage: "/images/menu/item3.png",
      name: "Pizzas",
    },
    {
      menuImage: "/images/menu/item4.png",
      name: "Drinks",
    },
    {
      menuImage: "/images/menu/item5.png",
      name: "Desserts",
    },
  ];

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
        {menuItems.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="bg-gray-100 hover:bg-[var(--primary-color)] hover:text-white transition-all duration-200 rounded-xl py-3 px-5 flex flex-col justify-center items-center gap-2 min-w-[90px] cursor-pointer">
              <Image
                src={item.menuImage}
                alt={item.name}
                width={75}
                height={48}
                className="object-contain h-[48px]"
              />
              <p className="text-sm font-medium text-center h-[40px]">{item.name}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MenuSlider;
