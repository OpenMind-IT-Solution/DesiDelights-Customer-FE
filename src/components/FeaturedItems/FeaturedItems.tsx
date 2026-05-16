"use client";

import {useLanguage} from "@/app/context/LanguageContext";
import {useCart} from "@/app/context/CartContext";
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
  price: number;
  image: string;
  type: string;
};

const FeaturedItems = () => {
  const {t} = useLanguage();
  const {cartItems, increaseQty, decreaseQty} = useCart();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const featuredItems: MenuItem[] = [
    {
      id: 1,
      name: "Fried Cheese Wonton",
      description: "Crispy fried cream cheese wontons...",
      price: 2.0,
      image: "/images/menu/item1.png",
      type: "veg",
    },
    {
      id: 2,
      name: "Panner Tikka Wrap",
      description: "Soft tortilla stuffed with marinated panner...",
      price: 3.2,
      image: "/images/menu/panner-wrap.png",
      type: "veg",
    },
    {
      id: 3,
      name: "Veggie Supreme Burger",
      description: "Loaded with grilled vegetables...",
      price: 2.8,
      image: "/images/menu/veg-burger.png",
      type: "veg",
    },
    {
      id: 4,
      name: "Crispy Potato Twisters",
      description: "Spiral-cut crispy potatoes...",
      price: 1.5,
      image: "/images/menu/potato-twisters.png",
      type: "veg",
    },
    {
      id: 5,
      name: "Cheesy Garlic Bread",
      description: "Oven-baked bread with garlic butter...",
      price: 2.5,
      image: "/images/menu/garlic-bread.png",
      type: "veg",
    },
  ];

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <h2 className="text-3xl font-black mb-8">{t("featuredItems")}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {featuredItems.map((item) => {
            const cartItem = cartItems.find((i) => i.id === item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-40 bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col grow">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{item.name}</h3>
                    <FaInfoCircle
                      onClick={() => setSelectedItem(item)}
                      className="cursor-pointer text-gray-400"
                    />
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-[var(--primary-color)] font-semibold">
                      €{item.price.toFixed(2)}
                    </span>

                    {cartItem ? (
                      <div className="flex items-center gap-2 bg-[var(--primary-color)] text-white px-3 py-1 rounded-full">
                        <button onClick={() => decreaseQty(item.id)}>-</button>
                        <span>{cartItem.qty}</span>
                        <button onClick={() => increaseQty(item.id)}>+</button>
                      </div>
                    ) : (
                      <Button onClick={() => setSelectedItem(item)}>
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
      </div>
    </section>
  );
};

export default FeaturedItems;
