"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import Slider from "react-slick";

export default function ImageAnim({ base, n }: { base: string; n: number }) {
  const frames = [];
  for (let i = 0; i < n; i++) {
    frames.push(`${base}_${i}.png`);
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className='w-full h-auto'>
      {/* @ts-ignore */}
      <Slider {...settings}>
        {frames.map((frame, index) => (
          <div key={index} className='w-full h-auto'>
            <img src={frame} alt={`Frame ${index + 1}`} className='w-full h-auto mx-auto' />
          </div>
        ))}
      </Slider>
    </div>
  );
}
