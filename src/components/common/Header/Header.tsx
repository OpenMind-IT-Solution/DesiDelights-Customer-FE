import Image from "next/image";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
import SearchComponent from "../SearchComponent/SearchComponent";
import CartButton from "./CartButton";
import LoginButton from "./LoginButton";
import Menu from "./menu/Menu";

const Header = () => {
  // const { lang, setLang } = useLanguage();
  return (
    <header className="sticky top-0 shadow-md py-3 z-10 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center gap-4">
          <Image src={"/images/logo.png"} alt="Logo" width={80} height={80} />
          <Menu />
          <div className="flex items-center gap-4">
            <SearchComponent />
            <LanguageDropdown />
            <CartButton />
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
