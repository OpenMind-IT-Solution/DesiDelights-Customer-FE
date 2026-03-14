"use client";

import {useCart} from "@/app/context/CartContext";
import {FaShoppingBag} from "react-icons/fa";

type Props = {
  onClick: () => void;
};

const CartButton = ({onClick}: Props) => {
  const {cartTotal} = useCart();

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-[#2c2c44] text-white px-5 py-2 rounded-full"
    >
      <FaShoppingBag />${Number(cartTotal).toFixed(2)}
    </button>
  );
};

export default CartButton;
