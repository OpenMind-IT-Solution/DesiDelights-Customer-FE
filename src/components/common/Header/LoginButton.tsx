"use client";

import {useEffect, useState, useRef} from "react";
import {usePathname, useRouter} from "next/navigation";
import {PiUserCircleFill} from "react-icons/pi";
import {FiShoppingBag, FiEdit, FiKey, FiLogOut} from "react-icons/fi";
import Button from "../Button/Button";
import {useLanguage} from "@/app/context/LanguageContext";

import { useAuth } from "@/app/context/AuthContext";

const LoginButton = () => {
  const {t} = useLanguage();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  const pathname = usePathname();

  if (!user) {
    const isLoginPage = pathname === "/login";
    const buttonLink = isLoginPage ? "/register" : "/login";
    const buttonText = isLoginPage ? "Sign Up" : t("login");

    return (
      <Button link={buttonLink} className="min-w-0 px-3 justify-center sm:min-w-[140px]">
        <PiUserCircleFill size={22} />
        <span className="hidden sm:inline">{buttonText}</span>
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-primary text-white px-3 sm:px-5 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
      >
        <PiUserCircleFill size={22} />
        <span className="hidden sm:inline">Account</span>
        <span className="ml-0.5 sm:ml-1">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border">
          {/* Profile */}
          <div className="flex items-center gap-4 p-4 border-b">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
              <PiUserCircleFill size={32} />
            </div>

            <div>
              <p className="font-semibold text-gray-800">
                {user.fullName}
              </p>
              <p className="text-sm text-gray-500">
                {user.email || "user@email.com"}
              </p>
            </div>
          </div>

          {/* Menu */}
          <div className="flex flex-col text-sm">
            <Item
              icon={<FiShoppingBag />}
              label="My Orders"
              onClick={() => {
                router.push("/my-orders");
                setOpen(false);
              }}
            />

            <Item
              icon={<FiEdit />}
              label="Edit Profile"
              onClick={() => {
                router.push("/profile");
                setOpen(false);
              }}
            />

            <Item
              icon={<FiKey />}
              label="Change Password"
              onClick={() => {
                router.push("/forgot-password");
                setOpen(false);
              }}
            />

            <div className="border-t mt-2" />

            <Item
              icon={<FiLogOut />}
              label="Logout"
              onClick={handleLogout}
              theme
            />
          </div>
        </div>
      )}
    </div>
  );
};

const Item = ({icon, label, onClick, theme}: any) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${
      theme
        ? "text-primary font-medium hover:bg-primary/10"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <span className="text-lg">{icon}</span>
    {label}
  </div>
);

export default LoginButton;
