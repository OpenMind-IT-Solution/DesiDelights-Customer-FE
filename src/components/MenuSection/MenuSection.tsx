import React from "react";
import Button from "../common/Button/Button";
import MenuSlider from "./MenuSider/MenuSlider";

const MenuSection = () => {
  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black">Our Menu</h2>
          <Button link="/menu" type="outline">
            View All
          </Button>
        </div>
        <MenuSlider />
      </div>
    </section>
  );
};

export default MenuSection;
