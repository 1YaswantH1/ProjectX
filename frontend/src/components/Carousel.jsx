import React, { useEffect, useRef, useState } from "react";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef(null);

  const totalSlides = images.length;

  // Automatically move slides
  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const goToSlide = (index) => {
    setIsTransitioning(true);
    if (index > totalSlides) return; // prevent overflow
    setCurrentIndex(index);
  };

  // Jump back to real first slide when fake slide transition ends
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (currentIndex === totalSlides) {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }
    };

    const track = trackRef.current;
    if (track) {
      track.addEventListener("transitionend", handleTransitionEnd);
    }

    return () => {
      if (track) {
        track.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
  }, [currentIndex, totalSlides]);

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  // All images + clone of first at end
  const slideImages = [...images, images[0]];

  return (
    <div className="relative w-full h-[70vh] overflow-hidden rounded-box bg-black">
      <div
        ref={trackRef}
        className={`flex h-full ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""
          }`}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {slideImages.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Slide ${index}`}
            className="w-full h-full object-contain flex-shrink-0"
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10">
        <button
          className="btn btn-circle bg-black/50 text-white border-none hover:bg-black"
          onClick={prevSlide}
        >
          ❮
        </button>
      </div>
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10">
        <button
          className="btn btn-circle bg-black/50 text-white border-none hover:bg-black"
          onClick={nextSlide}
        >
          ❯
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full ${index === currentIndex % totalSlides ? "bg-white" : "bg-gray-500"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
