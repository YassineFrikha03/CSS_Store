import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCircles = () => {
  // Définition des catégories avec l'aiguillage (path) exact vers tes nouvelles pages
  const categories = [
    { 
      name: 'MAILLOTS', 
      path: '/maillots',
      img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300' 
    },
    { 
      name: 'ÉCHARPES', 
      path: '/accessoires', // Redirige vers accessoires (où se trouve le filtre Écharpe)
      img: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=300' 
    },
    { 
      name: 'ACCESSOIRES', 
      path: '/accessoires',
      img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300' 
    },
    { 
      name: 'CASQUETTES', 
      path: '/accessoires', // Redirige vers accessoires (où se trouve le filtre Casquette)
      img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300' 
    },
    { 
      name: 'SACS', 
      path: '/accessoires', // Redirige vers accessoires (où se trouve le filtre Sac)
      img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300' 
    },
    { 
      name: 'PROMOTIONS', 
      path: '/promotions',
      img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300' 
    },
  ];

  return (
    <div className="bg-white py-10 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat, index) => (
          /* 🔄 Remplacement du div conteneur par un Link pour rendre toute la carte cliquable */
          <Link 
            key={index} 
            to={cat.path}
            className="bg-[#FAFAFA] border border-zinc-100 p-6 flex flex-col items-center justify-center text-center group hover:shadow-md hover:border-zinc-200 transition-all duration-300 rounded-none cursor-pointer"
          >
            {/* Conteneur de la bulle d'image */}
            <div className="w-24 h-24 overflow-hidden rounded-full bg-white flex items-center justify-center border border-zinc-200">
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="w-full h-full object-cover filter grayscale contrast-115 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            
            {/* Titre de la catégorie */}
            <h3 className="text-xs font-black uppercase tracking-wider text-black mt-4">
              {cat.name}
            </h3>
            
            {/* Petit lien d'action "Voir tout" */}
            <span className="text-[10px] text-zinc-400 font-bold mt-1 group-hover:text-black transition-colors">
              Voir tout &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryCircles;