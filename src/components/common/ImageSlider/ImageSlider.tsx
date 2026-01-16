"use client";

import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ImageSlider = ({ slides }: { slides: string[] }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      loop
      autoplay={{ delay: 10000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation={false}
      className={`w-full max-h-[600px] rounded-2xl overflow-hidden shadow-md`}
    >
      {slides.map((src, index) => (
        <SwiperSlide key={index}>
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover rounded-md"
            width={1920}
            height={600}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;
