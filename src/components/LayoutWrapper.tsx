"use client";

import {usePathname} from "next/navigation";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";

export default function LayoutWrapper({children}: {children: React.ReactNode}) {
  const pathname = usePathname();

  const hideRoutes = [
    "/login",
    "/forgot-password",
    "/register",
    "/verify",
    "/reset-password",
    "/guest-login",
  ];

  const hideLayout = hideRoutes.includes(pathname);

  return (
    <>
      {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
}
