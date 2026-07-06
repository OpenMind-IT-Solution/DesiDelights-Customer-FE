"use client";

import {usePathname} from "next/navigation";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export default function LayoutWrapper({children}: {children: React.ReactNode}) {
  const pathname = usePathname();

  const hideRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify",
    "/reset-password",
    "/guest-login",
  ];

  const hideLayout = hideRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideLayout && <Footer />}
      <WhatsAppWidget />
    </div>
  );
}
