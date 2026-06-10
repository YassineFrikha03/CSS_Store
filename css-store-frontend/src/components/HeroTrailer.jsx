import React from 'react';
import ProductGrid from './ProductGrid';

const HeroTrailer = ({ currentCategory }) => {
  return (
    <section className="relative min-h-screen w-full bg-black flex flex-col items-center justify-start overflow-x-hidden pt-24 pb-8">
      
      {/* Arrière-plan Cinéma Intégral */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-20 filter grayscale contrast-125 pointer-events-none"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-stadium-lights-shining-at-night-42171-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-[#0A0A0A]"></div>
      </div>

      {/* TITRE ET ACTIONS */}
      <div className="relative z-10 text-center px-4 select-none mb-6 max-w-3xl mx-auto mt-4">
        <div className="inline-block text-[9px] font-bold text-zinc-400 bg-white/5 border border-white/10 px-3 py-1.5 uppercase tracking-[0.25em]">
          CSS Official Store • Écosystème Moderne
        </div>
        
        <h1 className="mt-4 text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
          Noir et Blanc <br /> 
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>
            Dans la Peau
          </span>
        </h1>
        
        <p className="mt-3 text-[11px] text-zinc-400 max-w-sm mx-auto font-light tracking-wide leading-relaxed">
          Découvrez la nouvelle armure de combat et la collection streetwear officielle du Club Sportif Sfaxien.
        </p>
        
        <div className="mt-6 flex flex-row justify-center items-center gap-3">
          <button className="bg-white text-black hover:bg-zinc-200 font-bold text-[10px] tracking-widest py-3 px-6 transition-all duration-300 uppercase cursor-pointer">
            Pré-commander le maillot
          </button>
          <button className="bg-transparent text-white border border-zinc-700 hover:border-white font-bold text-[10px] tracking-widest py-3 px-6 transition-all duration-300 uppercase cursor-pointer">
            Explorer l'Armure
          </button>
        </div>
      </div>

      {/* GRILLE HORIZONTALE DOUBLE OPTIQUE */}
      <div className="relative z-10 w-full">
        <ProductGrid currentCategory={currentCategory} />
      </div>

    </section>
  );
};

export default HeroTrailer;