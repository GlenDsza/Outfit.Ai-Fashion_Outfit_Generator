import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs, EffectFade } from "swiper/modules";

const OutfitSwiper = ({ imagesObj, setTitle }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const swiperRef = useRef(null);
  const handleSlideChange = (swiper) => {
    setTitle(imagesObj[swiper.activeIndex].desc);
  };

  return (
    <>
      <div className="bg-transparent rounded-md h-[80vh] overflow-hidden ">
        <Swiper
          style={{
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          }}
          ref={(swiper) => {
            if (swiper) {
              swiperRef.current = swiper;
              swiper.on("slideChange", () => handleSlideChange(swiper));
            }
          }}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs, EffectFade]}
          className="mySwiper2 h-[55vh]"
          onSlideChange={handleSlideChange}
        >
          {imagesObj.map((image, i) => (
            <SwiperSlide key={i}>
              <img
                className="rounded-md"
                src={`data:image/png;base64,${image.imageString}`}
                alt={i}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={0}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper h-[15vh] mt-4"
        >
          {imagesObj.map((image, i) => (
            <SwiperSlide key={i}>
              <img
                className="rounded-md"
                src={`data:image/png;base64,${image.imageString}`}
                alt={i}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default OutfitSwiper;
