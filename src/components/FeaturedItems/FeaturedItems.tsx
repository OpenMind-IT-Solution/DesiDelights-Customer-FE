"use client";

import {useLanguage} from "@/app/context/LanguageContext";
import Image from "next/image";
import {FaInfoCircle} from "react-icons/fa";
import {PiBagSimpleFill} from "react-icons/pi";
import Button from "../common/Button/Button";
import {useState} from "react";
import MenuItemModal from "../MenuItemModel";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  type: string;
};

const FeaturedItems = () => {
  const {t} = useLanguage();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const featuredItems: MenuItem[] = [
    {
      id: 1,
      name: "Fried Cheese Wonton",
      description:
        "Crispy fried cream cheese wontons filled with cheese, lemon and garlic — served with sweet chili dip.",
      price: "€2.00",
      image: "/images/menu/item1.png",
      type: "veg",
    },
    {
      id: 2,
      name: "Panner Tikka Wrap",
      description:
        "Soft tortilla stuffed with marinated panner, onions, and capsicum — grilled to perfection.",
      price: "€3.20",
      image: "/images/menu/panner-wrap.png",
      type: "veg",
    },
    {
      id: 3,
      name: "Veggie Supreme Burger",
      description:
        "Loaded with grilled vegetables, lettuce, tomato, cheese, and house sauce in a toasted bun.",
      price: "€2.80",
      image: "/images/menu/veg-burger.png",
      type: "veg",
    },
    {
      id: 4,
      name: "Crispy Potato Twisters",
      description:
        "Spiral-cut crispy potatoes seasoned with house spices and served with spicy mayo.",
      price: "€1.50",
      image: "/images/menu/potato-twisters.png",
      type: "veg",
    },
    {
      id: 5,
      name: "Cheesy Garlic Bread",
      description:
        "Oven-baked bread topped with garlic butter, mozzarella, and herbs — soft, crispy, and cheesy.",
      price: "€2.50",
      image: "/images/menu/garlic-bread.png",
      type: "veg",
    },
  ];

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <h2 className="text-3xl font-black mb-8">{t("featuredItems")}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full h-40 bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width:768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>

              <div className="p-4 flex flex-col grow">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-semibold line-clamp-1">
                    {item.name}
                  </h3>

                  <FaInfoCircle
                    onClick={() => setSelectedItem(item)}
                    className="text-gray-400 text-sm cursor-pointer"
                  />
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[var(--primary-color)] font-semibold text-sm">
                    {item.price}
                  </span>

                  <Button onClick={() => setSelectedItem(item)}>
                    <PiBagSimpleFill className="text-sm" /> Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </div>
    </section>
  );
};

export default FeaturedItems;
