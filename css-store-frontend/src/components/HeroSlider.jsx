import React from 'react';
import Logo from '../assets/logocss.png';
import Acceuil from '../assets/accueil.png';


const HeroSlider = () => {
  return (
    <div className="w-full bg-black relative overflow-hidden min-h-[500px] md:h-[600px] flex items-center border-b border-zinc-900">
      
      {/* 1. ARRIÈRE-PLAN SOMBRE ET CINÉMA */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          src={Acceuil} 
          alt="CSS Stadium Background" 
          className="w-full h-full object-cover opacity-45 filter grayscale contrast-115 pointer-events-none"
        />
        {/* Dégradé progressif de gauche à droite */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15"></div>
        {/* Fondu vers le bas */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
      </div>

      {/* 2. CONTENU DU PREMIER PLAN */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* ZONE GAUCHE : Titres & Action */}
        <div className="text-white max-w-xl text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none text-white font-sans drop-shadow-md">
            CLUB SPORTIF <br />SFAXIEN
          </h2>
          <p className="mt-4 text-sm md:text-md tracking-[0.2em] text-zinc-300 font-bold uppercase font-mono">
            PLUS QU'UN CLUB, UNE LÉGENDE
          </p>
          <button className="mt-8 bg-white text-black hover:bg-zinc-200 font-bold text-xs tracking-widest py-4 px-8 uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer w-full sm:w-auto rounded-full border-none">
            Découvrir la collection <span className="text-sm">&rarr;</span>
          </button>
          
          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center md:justify-start gap-4 text-[10px] font-mono text-zinc-500">
            <span className="text-white border-b-2 border-white pb-1 font-bold">01</span>
            <span className="hover:text-white transition-colors cursor-pointer">02</span>
            <span className="hover:text-white transition-colors cursor-pointer">03</span>
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