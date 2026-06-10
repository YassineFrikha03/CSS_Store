import React from 'react';

const TrustBadges = () => {
  const badges = [
    { title: "LIVRAISON RAPIDE", desc: "Partout en Tunisie" },
    { title: "PAIEMENT SÉCURISÉ", desc: "Paiement à la livraison ou en ligne" },
    { title: "PRODUITS OFFICIELS", desc: "Articles 100% authentiques du CSS" },
    { title: "SERVICE CLIENT", desc: "À votre écoute 7j/7" }
  ];

  return (
    <div className="bg-white border-t border-b border-zinc-100 py-8 my-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge, idx) => (
          <div key={idx} className="flex items-center gap-4 px-4 justify-center sm:justify-start">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-black">{badge.title}</h4>
              <p className="text-[11px] text-zinc-500 font-light mt-0.5">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;