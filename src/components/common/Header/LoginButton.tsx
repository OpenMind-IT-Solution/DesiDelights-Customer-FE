"use client";
import { useLanguage } from "@/app/context/LanguageContext";
import { PiUserCircleFill } from "react-icons/pi";
import Button from "../Button/Button";

const LoginButton = () => {
  const { t } = useLanguage();
  return (
    <>
      <Button link="/login">
        <PiUserCircleFill size={22}/>
        {t("login")}
      </Button>
    </>
  );
};

export default LoginButton;
