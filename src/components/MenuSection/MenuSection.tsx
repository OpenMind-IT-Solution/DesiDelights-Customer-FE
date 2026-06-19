"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import Button from "../common/Button/Button";
import MenuSlider from "./MenuSider/MenuSlider";
import FeaturedItems from "../FeaturedItems/FeaturedItems";
import { websiteService } from "@/api/services/websiteService";
import { Category } from "@/types/api";

const MenuSection = () => {
  const { t } = useLanguage();
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryName, setActiveCategoryName] = useState<string>(t("featuredItems"));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await websiteService.getCategories();
        setCategories([{ id: "all", name: t("ourMenu") } as any, ...data]);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, [t]);

  useEffect(() => {
    const cat = categories.find((c) => String(c.id) === String(activeCategoryId));
    setActiveCategoryName(cat?.name || t("featuredItems"));
  }, [activeCategoryId, categories, t]);

  return (
    <section className="py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black">{t("ourMenu")}</h2>

          <Button link="/menu" type="outline">
            {t("viewAll")}
          </Button>
        </div>

        <MenuSlider
          activeCategoryId={activeCategoryId}
          onCategoryClick={(id) => setActiveCategoryId(id)}
        />

        {/* Render selected category items inside this section */}
        <div className="mt-6">
          <FeaturedItems categoryId={activeCategoryId} title={activeCategoryName} hideTitle compact limit={4} />
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
