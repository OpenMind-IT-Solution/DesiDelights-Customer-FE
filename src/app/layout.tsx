import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {LanguageProvider} from "./context/LanguageContext";
import {AuthProvider} from "./context/AuthContext";
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
  description: "Experience authentic pure vegetarian Indian cuisine at DesiDelights. Enjoy South Indian, vegan options, takeaway, dine-in, and online ordering.",
keywords: [
  "Pure Vegetarian Restaurant",
  "Pure Veg Restaurant",
  "Vegetarian Indian Restaurant",
  "Authentic Vegetarian Indian Cuisine",
  "Indian Vegetarian Food",
  "Best Vegetarian Restaurant",
  "Indian Food Belgium",
  "Vegetarian Restaurant Belgium",
  "Indian Cuisine",
  "North Indian Food",
  "South Indian Food",
  "Indian Street Food",
  "Masala Dosa",
  "Plain Dosa",
  "Mysore Dosa",
  "Rava Dosa",
  "Idli",
  "Medu Vada",
  "Uttapam",
  "Filter Coffee",
  "Vegetable Biryani",
  "Paneer Butter Masala",
  "Palak Paneer",
  "Dal Tadka",
  "Dal Makhani",
  "Chole Bhature",
  "Veg Thali",
  "Butter Naan",
  "Garlic Naan",
  "Tandoori Roti",
  "Pav Bhaji",
  "Ragda Patties",
  "Crispy Corn",
  "Pani Puri",
  "Bhel Puri",
  "Dahi Puri",
  "Samosa",
  "Vegan Indian Food",
  "Jain Food",
  "Vegetarian Catering",
  "Indian Catering",
  "Takeaway",
  "Food Delivery",
  "Dine In",
  "Online Food Order",
  "Family Restaurant",
  "Healthy Vegetarian Food",
  "Traditional Indian Recipes",
  "Fresh Indian Food",
  "DesiDelights"
],
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
          <AuthProvider>
            <CartProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
              <ToastContainer position="top-right" autoClose={3000} />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
