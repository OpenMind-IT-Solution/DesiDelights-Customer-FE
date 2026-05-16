"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {PiUserCircleFill} from "react-icons/pi";
import {FiShoppingBag, FiEdit, FiKey, FiLogOut} from "react-icons/fi";
import Button from "../Button/Button";
import {useLanguage} from "@/app/context/LanguageContext";

const LoginButton = () => {
  const {t} = useLanguage();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();

    window.addEventListener("focus", loadUser);

    return () => window.removeEventListener("focus", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  if (!user) {
    return (
      <Button link="/login">
        <PiUserCircleFill size={22} />
        {t("login")}
      </Button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[#FA664D] text-white px-5 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
      >
        <PiUserCircleFill size={22} />
        Account
        <span className="ml-1">{open ? "▴" : "▾"}</span>
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
                {user.name || "User"}
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
        ? "text-[#FA664D] font-medium hover:bg-[#FA664D]/10"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <span className="text-lg">{icon}</span>
    {label}
  </div>
);

export default LoginButton;
