"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Menu = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    { link: "/", name: t("home") },
    { link: "/menu", name: t("menu") },
    // {link: "/offers", name: t("offers")},
  ];

  return (
    <ul className="flex items-center gap-4">
      {menuItems.map((item, index) => {
        const isActive = pathname === item.link;
        return (
          <li
            key={index}
            className={`${
              isActive
                ? "text-[var(--primary-color)]"
                : "text-gray-700 hover:text-[var(--primary-color)]"
            } transition-colors font-semibold`}
          >
            <Link href={item.link}>{item.name}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;
