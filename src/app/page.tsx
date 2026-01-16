import dynamic from "next/dynamic";
const FeaturedItems = dynamic(
  () => import("@/components/FeaturedItems/FeaturedItems")
);
const HeroBanner = dynamic(() => import("@/components/HeroBanner/HeroBanner"));
const MenuSection = dynamic(
  () => import("@/components/MenuSection/MenuSection")
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
