import React, { useState, useEffect } from 'react';
import Image from "next/image";

const Carrousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    { src: "/assets/images/logo1.jpeg", alt: "Logo 1" },
    { src: "/assets/images/logo2.jpeg", alt: "Logo 2" },
    { src: "/assets/images/logo3.jpeg", alt: "Logo 3" },
    { src: "/assets/images/logo4.jpeg", alt: "Logo 4" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
     
      <div className="absolute top-4 left-4 z-50">
        <Image
          src="/assets/icons/logo.svg" 
          alt="Logo"
          width={50}
          height={50}
         
          className="w-auto h-auto"
        />
      </div>

      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0  left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="fill"
            priority={index === 0}
          />
        </div>
      ))}
      
    
      <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
            aria-current={currentSlide === index}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carrousel;