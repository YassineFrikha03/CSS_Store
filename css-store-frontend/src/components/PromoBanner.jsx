import React from 'react';

const PromoBanner = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 my-12">
      <div className="bg-black text-white p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 filter grayscale contrast-125 hidden md:block">
          <img src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500" alt="CSS Detail" className="w-full h-full object-cover" />
        </div>
        
        <div className="text-center md:text-left z-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter">PROMO DE LA SEMAINE</h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono uppercase tracking-widest">Offre valable jusqu'au 22 Juin</p>
        </div>

        <div className="text-center z-10 border-t border-b md:border-t-0 md:border-b-0 border-zinc-800 py-4 md:py-0">
          <span className="block text-4xl md:text-5xl font-black text-white font-mono">-20%</span>
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest block mt-1">SUR TOUS LES MAILLOTS</span>
        </div>

        <div className="z-10">
          <button className="bg-white text-black font-bold text-xs tracking-widest py-3 px-6 uppercase hover:bg-zinc-200 transition-colors cursor-pointer">
            Voir les offres &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;