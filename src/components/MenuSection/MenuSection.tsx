"use client";
import {useLanguage} from "@/app/context/LanguageContext";
import Button from "../common/Button/Button";
import MenuSlider from "./MenuSider/MenuSlider";

const MenuSection = () => {
  const {t} = useLanguage();

  return (
    <section className="py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black">{t("ourMenu")}</h2>

          <Button link="/menu" type="outline">
            {t("viewAll")}
          </Button>
        </div>

        <MenuSlider />
      </div>
    </section>
  );
};

export default MenuSection;
