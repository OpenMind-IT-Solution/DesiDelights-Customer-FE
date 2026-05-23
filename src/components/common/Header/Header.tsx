"use client";

import Image from "next/image";
import Link from "next/link";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
import SearchComponent from "../SearchComponent/SearchComponent";
import LoginButton from "./LoginButton";
import Menu from "./menu/Menu";
import CartButton from "./CartButton";
import CartDrawer from "./CartDrawer";
import {useState} from "react";

const Header = () => {
  const [showCart, setShowCart] = useState(false);

  return (
    <>
      <header className="sticky top-0 shadow-md py-3 sm:py-4 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
          <div className="flex justify-between items-center gap-4 sm:gap-6">
            <Link href="/" className="flex-shrink-0 cursor-pointer">
              <Image 
                src="/images/logo.png" 
                alt="Logo" 
                width={80} 
                height={80} 
                className="w-[60px] h-[60px] sm:w-[90px] sm:h-[90px] object-contain"
              />
            </Link>

            <div className="hidden lg:block">
              <Menu />
            </div>

            <div className="flex items-center gap-2 sm:gap-5">
              <div className="hidden sm:block">
                <SearchComponent />
              </div>
              <LanguageDropdown />
              <CartButton onClick={() => setShowCart(true)} />
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <CartDrawer show={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

export default Header;
