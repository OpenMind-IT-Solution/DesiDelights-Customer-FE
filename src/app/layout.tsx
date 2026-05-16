import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {LanguageProvider} from "./context/LanguageContext";
import {CartProvider} from "./context/CartContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DesiDelights",
  description: "Authenticate Indian Food | Indian Restaurant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <CartProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <ToastContainer position="top-right" autoClose={3000} />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
