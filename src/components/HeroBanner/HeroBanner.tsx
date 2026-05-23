"use client";

import React, { useState, useEffect } from "react";
import ImageSlider from "../common/ImageSlider/ImageSlider";
import { websiteService } from "@/api/services/websiteService";

interface HeroBannerProps {
  restaurantId?: number | string;
}

const HeroBanner = ({ restaurantId = 1 }: HeroBannerProps) => {
  const [slider, setSlider] = useState<string[]>([
    "/images/poster/mexi_bur_offer.png",
    "/images/poster/offer1.png",
    "/images/poster/Combo_offer.png",
    "/images/poster/offer2.png",
  ]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const fetchedBanners = await websiteService.getRestaurantBanners(restaurantId);
        if (fetchedBanners && fetchedBanners.length > 0) {
          setSlider(fetchedBanners);
        }
      } catch (error) {
        console.error("Failed to fetch dynamic restaurant banners:", error);
      }
    };

    fetchBanners();
  }, [restaurantId]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 pt-4 sm:pt-6 lg:pt-10">
      <div className="rounded-2xl overflow-hidden">
        <ImageSlider slides={slider} />
      </div>
    </section>
  );
};

export default HeroBanner;
