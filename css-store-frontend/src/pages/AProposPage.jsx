import React from 'react';
import Logo from '../assets/logocss.png';

const AProposPage = () => {
  // Les grandes dates clés de la frise chronologique (Timeline) de ta maquette
  const timelineEvents = [
    {
      year: "1928",
      title: "Fondation du Club",
      description: "Naissance du Club Tunisien, qui deviendra plus tard le Club Sportif Sfaxien, sous les couleurs originelles verte et rouge, avant d'adopter le noir et blanc mythique."
    },
    {
      year: "1969",
      title: "Premier Sacre National",
      description: "Le CSS décroche son tout premier titre de Champion de Tunisie, marquant le début d'une grande ère de domination sur le football tunisien."
    },
    {
      year: "1998",
      title: "Sacre Africain (Coupe de la CAF)",
      description: "Le club affirme sa dimension internationale en remportant son premier trophée continental africain face au ASC Jeanne d'Arc."
    },
    {
      year: "2006",
      title: "Une Épopée Légendaire",
      description: "Une année marquée par un parcours mémorable en Ligue des Champions de la CAF et une ferveur populaire inégalée qui a gravé le club dans la légende."
    }
  ];

  // Le palmarès officiel (Stats)
  const stats = [
    { value: "1928", label: "Fondation" },
    { value: "8", label: "Championnats" },
    { value: "7", label: "Coupes de Tunisie" },
    { value: "3", label: "Coupes de la CAF" }
  ];

  return (
    <div className="w-full bg-[#F9F9F9] min-h-screen py-12 font-sans text-black antialiased">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* =========================================================================
            1. SECTION EN-TÊTE : Grand Titre Immersif & Concept Asymétrique
            ========================================================================= */}
        <div className="text-zinc-400 text-[10px] uppercase font-mono tracking-[0.25em] mb-3 text-left">
          Boutique / <span className="text-black font-bold">L'Histoire</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
          {/* Bloc Titre Noir Profond (Prend 2 colonnes) */}
          <div className="lg:col-span-2 bg-black text-white p-8 md:p-12 flex flex-col justify-center text-left relative overflow-hidden">
            <div className="absolute right-0 bottom-0 text-[180px] font-black text-zinc-900/40 select-none leading-none font-sans translate-y-10 translate-x-10">
              CSS
            </div>
            <span className="text-[11px] font-mono tracking-[0.3em] text-zinc-400 uppercase mb-4 block">NOTRE ADN, NOTRE HISTOIRE</span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none mb-6">
              PLUS QU'UN CLUB, <br />UNE LÉGENDE.
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm max-w-xl font-light leading-relaxed">
              Depuis près d'un siècle, le Club Sportif Sfaxien fait vibrer les cœurs en Tunisie et sur tout le continent africain. Portés par des valeurs de combativité, d'excellence et de fidélité, nous écrivons chaque jour l'histoire en noir et blanc.
            </p>
          </div>

          {/* Bloc Blason Blanc Lumineux "SINCE 1928" (Prend 1 colonne) */}
          <div className="bg-white border border-zinc-200 p-8 flex flex-col items-center justify-center text-center select-none shadow-sm">
            <img 
              src={Logo} 
              alt="Blason Officiel CSS" 
              className="w-36 h-36 md:w-40 md:h-40 object-contain mb-4 filter drop-shadow-sm"
            />
            <div className="h-[2px] w-12 bg-black my-2"></div>
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-400 font-bold">SINCE</span>
            <span className="text-2xl font-black tracking-widest font-mono text-black">1928</span>
          </div>
        </div>

        {/* =========================================================================
            2. SECTION GRILLE DE PALMARÈS NUMÉRIQUE
            ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 select-none">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-zinc-200 p-6 text-left relative group hover:border-black transition-all duration-300">
              <span className="block text-3xl md:text-4xl font-black font-mono text-black leading-none">
                {stat.value}
              </span>
              <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase mt-2 block font-sans">
                {stat.label}
              </span>
              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-black group-hover:w-full transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* =========================================================================
            3. SECTION CHRONOLOGIE (TIMELINE VERTICALE FLUIDE)
            ========================================================================= */}
        <div className="max-w-4xl mx-auto text-left relative mb-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black uppercase tracking-wider text-black">Les Grandes Étapes</h2>
            <div className="h-[2px] w-12 bg-black mx-auto mt-2"></div>
          </div>

          {/* Ligne centrale de la Frise (Invisible sur mobile, centrée sur PC) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-zinc-200 -translate-x-1/2 z-0"></div>

          <div className="space-y-12 relative z-10">
            {timelineEvents.map((event, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Côté Contenu (Texte descriptif dans un bloc épuré) */}
                  <div className="w-full md:w-[45%] pl-10 md:pl-0">
                    <div className="bg-white border border-zinc-200 p-6 hover:shadow-md transition-shadow duration-300 relative">
                      {/* Petite flèche indicatrice pour le design */}
                      <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-zinc-200 rotate-45 ${
                        isEven ? '-left-[7px] border-t-0 border-r-0 border-b border-l' : '-right-[7px]'
                      }`}></div>
                      
                      <span className="inline-block bg-black text-white font-mono text-xs font-black px-3 py-1 uppercase tracking-widest mb-3">
                        {event.year}
                      </span>
                      <h3 className="text-sm font-black uppercase tracking-wide text-black mb-1">
                        {event.title}
                      </h3>
                      <p className="text-zinc-500 text-xs font-light leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Pastille Centrale Pivot (Le point d'ancrage sur la ligne) */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-black border-4 border-white flex items-center justify-center -translate-x-1/2 z-20 shadow-sm font-mono text-[9px] text-white font-bold select-none">
                    {idx + 1}
                  </div>

                  {/* Espace vide opposé pour équilibrer la grille sur PC */}
                  <div className="hidden md:block w-[45%]"></div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AProposPage;