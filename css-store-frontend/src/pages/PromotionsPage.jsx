import React from 'react';
import { useNavigate } from 'react-router-dom';

const PromotionsPage = () => {
  const navigate = useNavigate();

  // Les offres exclusives calquées sur ton wireframe 4
  const promoOffers = [
    {
      id: 1,
      title: "-20% SUR TOUS LES MAILLOTS",
      subtitle: "OFFRE VALABLE JUSQU'AU 22 JUIN",
      tag: "-20%",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600",
      targetPath: "/textiles",
      gridSpan: "md:col-span-2 h-80"
    },
    {
      id: 2,
      title: "PACK FAN",
      subtitle: "ÉCHARPE + CASQUETTE",
      priceTag: "60,000 DT",
      oldPrice: "Au lieu de 75,000 DT",
      image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600",
      targetPath: "/accessoires",
      gridSpan: "md:col-span-1 h-80"
    },
    {
      id: 3,
      title: "-15% SUR LES ACCESSOIRES",
      subtitle: "OFFRE VALABLE JUSQU'AU 22 JUIN",
      tag: "-15%",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600",
      targetPath: "/accessoires",
      gridSpan: "md:col-span-2 h-72"
    },
    {
      id: 4,
      title: "LIVRAISON OFFERTE",
      subtitle: "À PARTIR DE 150 DT D'ACHAT",
      icon: "🚚",
      targetPath: "/",
      gridSpan: "md:col-span-1 h-72 bg-gradient-to-br from-zinc-900/50 to-black/50"
    }
  ];

  return (
    <div className="w-full bg-zinc-950 min-h-screen pt-24 pb-10 relative overflow-hidden font-sans text-left">
      {/* Lueur de fond décorative */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* FIL D'ARIANE & TITRE */}
        <div className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-2">
          Accueil &gt; <span className="text-white font-bold">Promotions</span>
        </div>
        
        <div className="border-b border-white/10 pb-4 mb-8">
          <h1 className="text-3xl font-black uppercase tracking-wider text-white">Nos Promotions</h1>
        </div>

        {/* GRILLE ASYMÉTRIQUE DE BLOCS PROMO NOIRS (Fidèle à la maquette 4) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          {promoOffers.map((offer) => (
            <div 
              key={offer.id} 
              className={`bg-white/5 backdrop-blur-md text-white p-8 border border-white/10 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-white/20 transition-all duration-300 ${offer.gridSpan}`}
            >
              {/* Image d'ambiance intégrée en arrière-plan transparent */}
              {offer.image && (
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-25 filter grayscale contrast-125 transition-transform duration-700 group-hover:scale-105 pointer-events-none z-0 mix-blend-screen">
                  <img src={offer.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-zinc-950/80"></div>
                </div>
              )}

              {/* Contenu textuel de l'offre */}
              <div className="z-10 text-left max-w-xs">
                {/* Badge de pourcentage ou prix */}
                {offer.tag && (
                  <span className="block text-4xl md:text-5xl font-black font-mono tracking-tighter text-white mb-2 drop-shadow-md">
                    {offer.tag}
                  </span>
                )}
                
                <h2 className="text-xl font-black uppercase tracking-tight leading-tight">
                  {offer.title}
                </h2>
                
                <p className="text-[10px] text-zinc-400 font-mono uppercase mt-1.5 tracking-wider">
                  {offer.subtitle}
                </p>

                {/* Détails spécifiques pour le bloc Pack Fan */}
                {offer.priceTag && (
                  <div className="mt-4 font-sans">
                    <span className="block text-2xl font-black text-white">{offer.priceTag}</span>
                    <span className="text-[10px] text-zinc-500 line-through font-mono">{offer.oldPrice}</span>
                  </div>
                )}
              </div>

              {/* Rendu spécifique pour le bloc de Livraison sans image */}
              {offer.icon && (
                <div className="absolute right-6 bottom-20 text-6xl opacity-20 filter grayscale pointer-events-none">
                  {offer.icon}
                </div>
              )}

              {/* Bouton d'action "PROFITER" calqué sur le wireframe */}
              <div className="z-10 mt-6 text-left">
                <button 
                  onClick={() => navigate(offer.targetPath)}
                  className="bg-white text-black font-bold text-[9px] tracking-widest py-2.5 px-6 uppercase rounded-xl hover:bg-zinc-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all cursor-pointer border-none"
                >
                  Profiter &rarr;
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* PETIT BANDEAU DE RÉASSURANCE EN BAS (Comme sur la maquette 4) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-center md:text-left">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-white">⚡ LIVRAISON RAPIDE</h4>
            <p className="text-[9px] text-zinc-500 mt-0.5">Partout en Tunisie</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-white">🛡️ PAIEMENT SÉCURISÉ</h4>
            <p className="text-[9px] text-zinc-500 mt-0.5">Paiement à la livraison</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-white">🏳️ PRODUITS OFFICIELS</h4>
            <p className="text-[9px] text-zinc-500 mt-0.5">Articles 100% authentiques</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-white">📞 SERVICE CLIENT</h4>
            <p className="text-[9px] text-zinc-500 mt-0.5">À votre écoute 7j/7</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PromotionsPage;