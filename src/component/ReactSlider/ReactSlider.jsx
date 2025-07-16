/* eslint-disable no-unused-vars */
import React from "react";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowUpwardIcon } from "@/assets";
export default function SimpleSlider({ children, responsive }) {
  var settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    speed: 500,
    arrows: false,
    swipeToSlide: true,
    variableWidth: true,
    responsive: responsive || [
      {
        breakpoint: 1380,
        settings: {
          slidesToShow: 3.5,
          // slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1160,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      // {
      //   breakpoint: 460,
      //   settings: {
      //     slidesToShow: 1.1,
      //     slidesToScroll: 1,
      //   },
      // },
    ],
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>{children}</Slider>
    </div>
  );
}
