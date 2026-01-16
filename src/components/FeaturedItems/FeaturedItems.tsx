"use client";

import Image from "next/image";
import { FaInfoCircle } from "react-icons/fa";
import { PiBagSimpleFill } from "react-icons/pi";
import Button from "../common/Button/Button";

const FeaturedItems = () => {
  const featuredItems = [
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
    {
      id: 6,
      name: "Classic Iced Coffee",
      description:
        "Cold brewed coffee served over ice, topped with sweet foam and chocolate drizzle.",
      price: "€1.50",
      image: "/images/menu/iced-coffee.png",
      type: "veg",
    },
    {
      id: 7,
      name: "Fried Cheese Wonton",
      description:
        "Crispy fried cream cheese wontons filled with cheese, lemon and garlic — served with sweet chili dip.",
      price: "€2.00",
      image: "/images/menu/item1.png",
      type: "veg",
    },
    {
      id: 8,
      name: "Panner Tikka Wrap",
      description:
        "Soft tortilla stuffed with marinated panner, onions, and capsicum — grilled to perfection.",
      price: "€3.20",
      image: "/images/menu/panner-wrap.png",
      type: "veg",
    },
    {
      id: 9,
      name: "Veggie Supreme Burger",
      description:
        "Loaded with grilled vegetables, lettuce, tomato, cheese, and house sauce in a toasted bun.",
      price: "€2.80",
      image: "/images/menu/veg-burger.png",
      type: "veg",
    },
    {
      id: 10,
      name: "Crispy Potato Twisters",
      description:
        "Spiral-cut crispy potatoes seasoned with house spices and served with spicy mayo.",
      price: "€1.50",
      image: "/images/menu/potato-twisters.png",
      type: "veg",
    },
  ];

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-black mb-6">Featured Items</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full h-40 bg-gray-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                    <Image
                      src="/images/no-image.png"
                      alt="No Image"
                      width={60}
                      height={60}
                    />
                    <p className="text-sm font-medium">No Image Found!</p>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-semibold line-clamp-1">
                    {item.name}
                  </h3>
                  <FaInfoCircle className="text-gray-400 text-sm" />
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[var(--primary-color)] font-semibold text-sm">
                    {item.price}
                  </span>

                  <Button>
                    <PiBagSimpleFill className="text-sm" /> Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
