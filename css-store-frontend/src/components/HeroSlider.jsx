import React, { useState, useEffect } from 'react';
import Logo from '../assets/logocss.png';
import slide1 from '../assets/mhiri.png';
import slide2 from '../assets/vsasg.jpg';
import slide3 from '../assets/vsst.jpg';

const slides = [
  { id: 1, image: slide1, subtitle: "PLUS QU'UN CLUB, UNE LÉGENDE" },
  { id: 2, image: slide2, subtitle: "SOUTENEZ L'ÉQUIPE À DOMICILE" },
  { id: 3, image: slide3, subtitle: "LA PASSION DU STADE" }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change de slide toutes les 5 secondes
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-black relative overflow-hidden min-h-[500px] md:h-[600px] flex items-center border-b border-zinc-900">
      
      {/* 1. ARRIÈRE-PLAN SOMBRE ET CINÉMA AVEC TRANSITION */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 w-full h-full z-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={slide.image} 
            alt={`Slide ${slide.id}`} 
            className="w-full h-full object-cover opacity-45 filter grayscale contrast-115 pointer-events-none"
          />
          {/* Dégradé progressif de gauche à droite */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15"></div>
          {/* Fondu vers le bas */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        </div>
      ))}

      {/* 2. CONTENU DU PREMIER PLAN */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* ZONE GAUCHE : Titres & Action */}
        <div className="text-white max-w-xl text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none text-white font-sans drop-shadow-md">
            CLUB SPORTIF <br />SFAXIEN
          </h2>
          <p className="mt-4 text-sm md:text-md tracking-[0.2em] text-zinc-300 font-bold uppercase font-mono transition-opacity duration-500">
            {slides[currentSlide].subtitle}
          </p>
          <button className="mt-8 bg-white text-black hover:bg-zinc-200 font-bold text-xs tracking-widest py-4 px-8 uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer w-full sm:w-auto rounded-full border-none">
            Découvrir la collection <span className="text-sm">&rarr;</span>
          </button>
          
          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center md:justify-start gap-4 text-[10px] font-mono text-zinc-500">
            {slides.map((slide, index) => (
              <span 
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`transition-colors cursor-pointer ${
                  currentSlide === index ? 'text-white border-b-2 border-white pb-1 font-bold' : 'hover:text-white'
                }`}
              >
                0{slide.id}
              </span>
            ))}
          </div>
        </div>

        {/* ZONE DROITE : Logo CSS & Fondation */}
        <div className="flex flex-col items-center justify-center w-64 text-center select-none transition-transform duration-500 hover:scale-102">
          <img 
            src={Logo} 
            alt="Blason CSS" 
            className="w-36 h-36 md:w-44 md:h-44 object-contain mb-4 filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.2)]"
          />
          <div className="h-[1.5px] w-12 bg-white/60 my-2"></div>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-400 font-bold">SINCE</span>
          <span className="text-xl font-black tracking-widest font-mono text-white">1928</span>
        </div>

      </div>
    </div>
  );
};

export default HeroSlider;