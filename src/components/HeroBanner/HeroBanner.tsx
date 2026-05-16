import React from "react";
import ImageSlider from "../common/ImageSlider/ImageSlider";

const HeroBanner = () => {
  const slider = [
    "/images/poster/mexi_bur_offer.png",
    "/images/poster/offer1.png",
    "/images/poster/Combo_offer.png",
    "/images/poster/offer2.png",
  ];

  return (
    <section className="px-20 pt-10">
      <div className="rounded-2xl overflow-hidden">
        <ImageSlider slides={slider} />
      </div>
    </section>
  );
};

export default HeroBanner;
