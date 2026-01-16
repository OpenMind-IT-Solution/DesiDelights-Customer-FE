import Image from "next/image";
import Link from "next/link";
import { BsInstagram, BsWhatsapp } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa6";
import { LiaHeadphonesSolid } from "react-icons/lia";
import { TfiEmail } from "react-icons/tfi";
const Footer = () => {
  return (
    <footer className="py-10 bg-gray-100">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="w-1/3 text-lg">
            <Image
              className="max-h-20 max-w-36 object-contain mb-2 object-left"
              src={"/images/logo.png"}
              width={150}
              height={80}
              alt="Logo"
            />
            <Link
              className="flex items-center gap-2 font-semibold py-2 hover:text-(--primary-color)"
              href={"mailto:info@desidelights.com"}
            >
              <TfiEmail /> info@desidelights.com
            </Link>
            <Link
              className="flex items-center gap-2 font-semibold py-2 hover:text-(--primary-color)"
              href={"tel:+3232232232"}
            >
              <LiaHeadphonesSolid /> +32 332 556 2224
            </Link>
          </div>
          <div className="w-1/3">
            <h3 className="font-bold pb-4 text-xl">Useful Links:</h3>
            <ul className="flex flex-col">
              <li className="pb-2">
                <Link className="hover:text-(--primary-color)" href={"#"}>
                  About Us
                </Link>
              </li>
              <li className="pb-2">
                <Link className="hover:text-(--primary-color)" href={"#"}>
                  Contact Us
                </Link>
              </li>
              <li className="pb-2">
                <Link className="hover:text-(--primary-color)" href={"#"}>
                  Terms & Conditions
                </Link>
              </li>
              <li className="pb-2">
                <Link className="hover:text-(--primary-color)" href={"#"}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-1/3">
            <div className="flex flex-col gap-3">
              <h3 className="font-bold pb-4 text-xl">Follow us on: </h3>
              <ul className="flex flex-wrap gap-3 mb-4">
                <li className="p-3 border border-(--primary-color) rounded-full hover:bg-(--primary-color) hover:text-white">
                  <Link href={""}>
                    <FaFacebook />
                  </Link>
                </li>
                <li className="p-3 border border-(--primary-color) rounded-full hover:bg-(--primary-color) hover:text-white">
                  <Link href={""}>
                    <BsInstagram />
                  </Link>
                </li>
                <li className="p-3 border border-(--primary-color) rounded-full hover:bg-(--primary-color) hover:text-white">
                  <Link href={""}>
                    <BsWhatsapp />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
