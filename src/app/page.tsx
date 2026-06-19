import dynamic from "next/dynamic";
import LoginPage from "./login/page";
const HeroBanner = dynamic(() => import("@/components/HeroBanner/HeroBanner"));
const MenuSection = dynamic(
  () => import("@/components/MenuSection/MenuSection"),
);
const FeaturedItems = dynamic(
  () => import("@/components/FeaturedItems/FeaturedItems"),
);

export default function Home() {
  return (
    <>
      <HeroBanner />
      <MenuSection />
      <FeaturedItems />
    </>
  );
}
