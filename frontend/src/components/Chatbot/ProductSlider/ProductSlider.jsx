import { useSelector } from "react-redux";
import { NextBtn, PreviousBtn } from "../../Home/Banner/Banner";
import React from "react";
import Slider from "react-slick";
import Product from "../../Home/ProductSlider/Product";
import { getRandomProducts } from "../../../utils/functions";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 6,
  initialSlide: 1,
  swipe: false,
  prevArrow: <PreviousBtn />,
  nextArrow: <NextBtn />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const ProductSlider = () => {
  const { loading, products } = useSelector((state) => state.products);

  return (
    <section className="bg-white w-full shadow overflow-hidden h-[31vh] rounded-md">
      <Slider
        {...settings}
        className="flex items-center justify-between p-1 h-[31vh]"
      >
        {products &&
          getRandomProducts(products, 12).map((product) => (
            <Product {...product} key={product._id} />
          ))}
      </Slider>
    </section>
  );
};

export default ProductSlider;
