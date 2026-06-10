import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import Logo from '../assets/logocss.png';

const Navbar = () => {
  const { getItemCount, setIsCartOpen } = useCart();
  const { user, logoutUser } = useUser();
  const location = useLocation(); // Détecte la page active pour le soulignement noir

  // 1. Liste de base des onglets visibles par tous les supporters (Login/Register retirés d'ici pour la clarté)
  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/textiles', label: 'Textiles' },
    { path: '/accessoires', label: 'Accessoires' },
    { path: '/promotions', label: 'Promotions' },
    { path: '/contact', label: 'Contact' },
    { path: '/a-propos', label: 'À Propos' }
  ];

  // ⚡ 2. Injection dynamique de l'onglet si l'utilisateur connecté est un administrateur
  if (user && user.role === 'admin') {
    navLinks.push({ path: '/admin', label: 'Admin Dashboard' });
  }

  return (
    <header className="w-full fixed top-0 left-0 z-40 select-none font-sans">
      {/* 1. TOP-BAR DE LIVRAISON (Bandeau noir fin en haut de la maquette) */}
      <div className="bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase py-2.5 text-center">
        LIVRAISON RAPIDE PARTOUT EN TUNISIE 🇹🇳
      </div>

      {/* 2. MENU PRINCIPAL BLANC (Fidèle aux wireframes) */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-zinc-200 px-6 md:px-12 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Identité Gauche : Logo Club + Nom officiel aligné */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src={Logo} 
            alt="Club Sportif Sfaxien Logo" 
            className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col text-left">
            <span className="font-black text-[11px] tracking-wider text-black uppercase leading-tight">CLUB SPORTIF</span>
            <span className="font-black text-base tracking-widest text-black uppercase leading-none">SFAXIEN</span>
          </div>
        </Link>

        {/* Liens de Navigation Centraux (Texte noir, soulignement au survol/actif) */}
        <div className="flex items-center gap-5 md:gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const isAdminTab = link.path === '/admin';
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs uppercase tracking-widest pb-1 transition-all relative ${
                  isActive 
                    ? 'text-black border-b-2 border-black font-black' 
                    : isAdminTab
                      ? 'text-red-600 hover:text-red-700 font-black tracking-wide' // Style distinct pour l'onglet admin
                      : 'text-zinc-400 hover:text-black font-bold'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Zone Droite : Espace Client & Bouton Panier */}
        <div className="flex items-center gap-6">
          
          {/* Authentification Supporter reliée à tes nouvelles pages */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-600">
                Supporter: {user.name.split(' ')[0]}
              </span>
              <button 
                onClick={logoutUser} 
                className="text-[9px] uppercase border border-zinc-300 px-2.5 py-1 hover:border-black font-bold transition-colors text-black cursor-pointer bg-white"
              >
                Quitter
              </button>
            </div>
          ) : (
            /* 🟢 Changement ici : Devient un vrai lien cliquable vers la page /login */
            <Link 
              to="/login" 
              className="text-xs uppercase font-bold tracking-wider text-zinc-700 hover:text-black transition-colors cursor-pointer"
            >
              Connexion
            </Link>
          )}

          {/* Bouton Panier Officiel (Rectangle noir à écriture blanche) */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className="relative bg-black text-white font-black text-xs px-5 py-2.5 tracking-widest uppercase hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer rounded-none border-none"
          >
            PANIER
            {getItemCount() > 0 && (
              <span className="bg-white text-black text-[9px] font-mono px-1.5 py-0.5 rounded-full ml-0.5 font-black">
                {getItemCount()}
              </span>
            )}
          </button>
        </div>

      </nav>
    </header>
  );
};

export default Navbar;