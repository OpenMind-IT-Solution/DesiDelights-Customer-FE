"use client";

import {useLanguage} from "@/app/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import {BsInstagram, BsWhatsapp} from "react-icons/bs";
import {FaFacebook} from "react-icons/fa6";
import {LiaHeadphonesSolid} from "react-icons/lia";
import {TfiEmail} from "react-icons/tfi";

const Footer = () => {
  const {t} = useLanguage();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Image
              src={"/images/logo.png"}
              width={150}
              height={80}
              alt="Logo"
              className="mb-4"
            />

            <div className="flex gap-3 mt-6">
              <Link
                href=""
                className="w-10 h-10 flex items-center justify-center border border-(--primary-color) rounded-full text-(--primary-color) hover:bg-(--primary-color) hover:text-white transition"
              >
                <FaFacebook />
              </Link>

              <Link
                href=""
                className="w-10 h-10 flex items-center justify-center border border-(--primary-color) rounded-full text-(--primary-color) hover:bg-(--primary-color) hover:text-white transition"
              >
                <BsInstagram />
              </Link>

              <Link
                href=""
                className="w-10 h-10 flex items-center justify-center border border-(--primary-color) rounded-full text-(--primary-color) hover:bg-(--primary-color) hover:text-white transition"
              >
                <BsWhatsapp />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t("usefulLink")}</h3>

            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  className="hover:text-[var(--primary-color)]"
                  href="/about"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link className="hover:text-(--primary-color)" href={"#"}>
                  {t("contactUs")}
                </Link>
              </li>

              <li>
                <Link className="hover:text-(--primary-color)" href={"#"}>
                  {t("terms")}
                </Link>
              </li>

              <li>
                <Link className="hover:text-(--primary-color)" href={"#"}>
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>

            <Link
              className="flex items-center gap-3 text-gray-600 mb-3 hover:text-(--primary-color)"
              href={"mailto:info@desidelights.com"}
            >
              <TfiEmail />
              info@desidelights.com
            </Link>

            <Link
              className="flex items-center gap-3 text-gray-600 hover:text-(--primary-color)"
              href={"tel:+3232232232"}
            >
              <LiaHeadphonesSolid />
              +32 332 556 2224
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Desi Delights. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
