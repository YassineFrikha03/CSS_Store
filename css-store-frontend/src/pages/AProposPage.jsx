import React, { useEffect, useState } from 'react';
import Logo from '../assets/logocss.png';
import { Trophy, Star, Shield, MapPin, Users, Flame, Target, ChevronRight } from 'lucide-react';

const AProposPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const timelineEvents = [
    { year: "1928", title: "Fondation du Club", description: "Naissance officielle du club sous le nom de 'Club Tunisien'. À ses débuts, le club arborait les couleurs verte et rouge." },
    { year: "1962", title: "Nouvelle Identité", description: "Le club est rebaptisé 'Club Sportif Sfaxien' (CSS) et adopte officiellement les couleurs mythiques Noir et Blanc." },
    { year: "1969", title: "Premier Sacre National", description: "Le CSS remporte son premier titre de Champion de Tunisie, ouvrant la voie à des décennies de succès." },
    { year: "1998", title: "Gloire Africaine", description: "Premier trophée continental majeur avec la victoire en Coupe de la CAF, confirmant la dimension internationale du club." },
    { year: "2007-2013", title: "Hégémonie Continentale", description: "Le CSS réalise un triplé historique en remportant la Coupe de la confédération de la CAF à trois reprises (2007, 2008, 2013)." }
  ];

  const stats = [
    { value: "8", label: "Championnats de Tunisie", icon: <Trophy className="w-6 h-6 mb-2 text-yellow-500" /> },
    { value: "7", label: "Coupes de Tunisie", icon: <Shield className="w-6 h-6 mb-2 text-zinc-300" /> },
    { value: "3", label: "Coupes Confédération CAF", icon: <Star className="w-6 h-6 mb-2 text-yellow-500" /> },
    { value: "4", label: "Autres Titres Continentaux", icon: <Trophy className="w-6 h-6 mb-2 text-zinc-300" /> }
  ];

  const legends = [
    { name: "Hammadi Agrebi", role: "Milieu Offensif", desc: "Le 'Magicien'. L'icône absolue et le joueur le plus élégant de l'histoire du football tunisien." },
    { name: "Mongi Dalhoum", role: "Attaquant", desc: "Le meilleur buteur historique du CSS avec 106 réalisations. Une véritable machine à marquer des années 70." },
    { name: "Mokhtar Dhouib", role: "Défenseur", desc: "Légende défensive, héros de la Coupe du Monde 1978 avec l'équipe nationale tunisienne." },
    { name: "Ali Maâloul", role: "Arrière Gauche", desc: "L'un des capitaines les plus emblématiques de l'ère moderne, doté d'une frappe redoutable et d'un leadership incontesté." },
    { name: "Skander Souayah", role: "Meneur de Jeu", desc: "Le maestro des années 90, artisan principal du premier sacre continental du club en 1998." }
  ];

  return (
    <div className="w-full bg-zinc-950 min-h-screen text-white font-sans selection:bg-white selection:text-black">
      
      {/* HERO SECTION */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-zinc-900 via-black to-zinc-950 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] z-0"></div>
        
        <div className={`relative z-10 text-center px-4 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">La Fierté du Sud - Depuis 1928</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none">
            La Légende <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-600">Noir & Blanc</span>
          </h1>
          <p className="max-w-3xl mx-auto text-zinc-400 text-sm md:text-lg font-light leading-relaxed mb-12">
            Le Club Sportif Sfaxien (CSS) n'est pas qu'un simple club de football, c'est une institution monumentale. 
            Une histoire bâtie sur la passion d'une ville, un palmarès inégalé sur la scène continentale, et une identité de jeu spectaculaire qui impose le respect de tous ses adversaires.
          </p>
          <img src={Logo} alt="Logo CSS" className="w-32 h-32 md:w-48 md:h-48 mx-auto object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform duration-500" />
        </div>
      </div>

      {/* PALMARÈS SECTION */}
      <div className="py-24 px-4 md:px-8 border-y border-white/10 bg-black/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">La Vitrine des Trophées</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-white to-zinc-600 mx-auto"></div>
            <p className="mt-6 text-zinc-400 max-w-2xl mx-auto">Le CSS est reconnu comme l'un des clubs les plus titrés d'Afrique, redouté pour sa culture de la gagne en Coupe de la Confédération de la CAF.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 overflow-hidden backdrop-blur-md">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  {stat.icon}
                  <span className="text-5xl md:text-6xl font-black font-mono tracking-tighter mt-4 mb-2">{stat.value}</span>
                  <span className="text-xs md:text-sm text-zinc-400 uppercase tracking-wider font-semibold">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TIMELINE SECTION */}
      <div className="py-24 px-4 md:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">L'Épopée Temporelle</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-white to-zinc-600 mx-auto md:mx-0"></div>
          </div>

          <div className="relative border-l border-white/20 pl-8 md:pl-0 md:border-l-0">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2"></div>
            <div className="space-y-16">
              {timelineEvents.map((event, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''} group`}>
                    <div className="w-full md:w-[45%]">
                      <div className={`bg-zinc-900/50 border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(255,255,255,0.1)] relative`}>
                        <div className="text-3xl font-black font-mono text-white/20 absolute top-4 right-6 group-hover:text-white/40 transition-colors duration-300">
                          {event.year}
                        </div>
                        <h3 className="text-xl font-bold uppercase tracking-wide text-white mb-4 pr-16">{event.title}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-[-37px] top-8 md:left-1/2 md:top-1/2 w-4 h-4 rounded-full bg-black border-2 border-white -translate-y-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-150 transition-transform duration-300"></div>
                    <div className="hidden md:block w-[45%]"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RIVALRIES & DERBIES SECTION (POUR LES FANS ADVERSES ET SUPPORTERS) */}
      <div className="py-24 px-4 md:px-8 border-y border-white/10 bg-zinc-900/30 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Flame className="w-12 h-12 text-zinc-300 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Le Classico & La Rivalité</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-zinc-400 to-zinc-600 mx-auto"></div>
            <p className="mt-6 text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Le football tunisien vibre au rythme des "Classicos". Affronter le CSS au Stade Taïeb-Mehiri est la hantise de tous les clubs du pays. 
              Les confrontations historiques contre l'Espérance Sportive de Tunis (EST), l'Étoile Sportive du Sahel (ESS) et le Club Africain (CA) sont des monuments du football maghrébin, caractérisés par une intensité tactique et une ferveur en tribunes sans pareil.
            </p>
          </div>
        </div>
      </div>

      {/* HALL OF FAME SECTION */}
      <div className="py-24 px-4 md:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Le Hall of Fame</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-white to-zinc-600"></div>
            <p className="mt-6 text-zinc-400 max-w-2xl">Des générations de footballeurs hors normes ont porté ce maillot, marquant à jamais l'histoire du football africain et mondial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legends.map((legend, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300 group">
                <h4 className="text-xl font-bold uppercase mb-1 flex items-center justify-between">
                  {legend.name}
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h4>
                <span className="text-xs font-mono tracking-widest text-zinc-400 block mb-4">{legend.role}</span>
                <p className="text-sm text-zinc-500 leading-relaxed">{legend.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SOCIOS & ACADEMY SECTION */}
      <div className="py-24 px-4 md:px-8 border-t border-white/10 bg-gradient-to-t from-black to-zinc-950 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Le modèle Socios */}
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity duration-500">
              <Users className="w-32 h-32 text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase mb-4 relative z-10">Le Phénomène Socios CSS</h3>
            <p className="text-zinc-400 leading-relaxed mb-6 relative z-10">
              Lancé en 2008, le réseau <span className="text-white font-bold">Socios CSS</span> est une initiative pionnière en Afrique. Inspiré des grands clubs européens (comme le FC Barcelone), ce modèle d'actionnariat populaire permet aux supporters de financer les infrastructures du club et de participer activement à son développement. Une preuve d'amour inconditionnel.
            </p>
          </div>

          {/* L'académie */}
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity duration-500">
              <Target className="w-32 h-32 text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase mb-4 relative z-10">L'Académie : La Fabrique à Talents</h3>
            <p className="text-zinc-400 leading-relaxed mb-6 relative z-10">
              Le CSS est historiquement réputé pour son centre de formation d'excellence, la fameuse "Juventus des Arabes". Le club a toujours privilégié la formation de jeunes talents locaux qui finissent par briller en équipe nationale et dans les plus grands championnats européens.
            </p>
          </div>

        </div>

        {/* Closing phrase */}
        <div className="max-w-7xl mx-auto text-center mt-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-white/20 mb-6 bg-white/5 backdrop-blur-sm">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-zinc-300">Stade Taïeb-Mehiri</h2>
          <p className="text-zinc-500 font-mono text-sm mt-2">Le Chaudron de Sfax - Le cœur battant du Sud</p>
        </div>
      </div>

    </div>
  );
};

export default AProposPage;