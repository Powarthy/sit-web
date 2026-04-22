"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/images/diapo/French_Cafe_stillit11.webp",
  "/images/diapo/French_Cafe_stillit27.webp",
  "/images/diapo/French_Cafe_stillit39.webp",
  "/images/diapo/French_Cafe_stillit42.webp",
  "/images/diapo/French_Cafe_stillit44.webp",
  "/images/diapo/French_Cafe_stillit45.webp",
  "/images/diapo/French_Cafe_stillit69.webp",
  "/images/diapo/French_Cafe_stillit74.webp",
  "/images/diapo/French_Cafe_stillit75.webp"
];

export default function SignatureSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[4/5] md:aspect-[3/4] w-full max-w-2xl ml-auto overflow-hidden bg-espresso/5">
      <AnimatePresence mode="sync">
        {images.map((src, index) => (
          index === currentIndex && (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "grayscale(10%) contrast(105%)"
              }}
            />
          )
        ))}
      </AnimatePresence>
      
      {/* Modern minimal indicators */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center gap-2 z-10 px-6">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-500 rounded-full h-1 ${
              idx === currentIndex ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
