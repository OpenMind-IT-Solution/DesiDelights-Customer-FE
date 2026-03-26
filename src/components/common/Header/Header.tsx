"use client";

import Image from "next/image";
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
      <header className="sticky top-0 shadow-md py-4 bg-white z-50">
        <div className="px-20">
          <div className="flex justify-between items-center gap-6">
            <Image src="/images/logo.png" alt="Logo" width={90} height={90} />

            <Menu />

            <div className="flex items-center gap-5">
              <SearchComponent />
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
