import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { User as UserIcon, Menu, X, ShoppingBag } from 'lucide-react';
import Logo from '../assets/logocss.png';

const Navbar = () => {
  const { getItemCount, setIsCartOpen } = useCart();
  const { user, logoutUser } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <div className="bg-black text-zinc-300 border-b border-white/10 text-[10px] font-bold tracking-[0.2em] uppercase py-2.5 text-center">
        LIVRAISON RAPIDE PARTOUT EN TUNISIE 🇹🇳
      </div>

      <nav className="bg-zinc-950/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 lg:px-12 py-3 lg:py-4 flex justify-between items-center shadow-sm transition-all duration-300">
        
        {/* Identité Gauche : Logo Club + Nom officiel aligné */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-white/5 rounded-full blur-md group-hover:bg-white/10 transition-all"></div>
            <img 
              src={Logo} 
              alt="Club Sportif Sfaxien Logo" 
              className="w-10 h-10 lg:w-12 lg:h-12 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-black text-[10px] lg:text-[11px] tracking-wider text-white uppercase leading-tight font-sans">CLUB SPORTIF</span>
            <span className="font-black text-sm lg:text-base tracking-[0.2em] text-white uppercase leading-none font-sans">SFAXIEN</span>
          </div>
        </Link>

        {/* Bouton Hamburger (Mobile) */}
        <button 
          className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
        </button>

        {/* Liens de Navigation Centraux (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const isAdminTab = link.path === '/admin';
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs uppercase tracking-widest py-1 transition-all relative font-sans ${
                  isActive 
                    ? 'text-white font-black' 
                    : isAdminTab
                      ? 'text-red-500 hover:text-red-400 font-bold tracking-wide'
                      : 'text-zinc-400 hover:text-white font-semibold'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white rounded-t-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Zone Droite : Espace Client & Bouton Panier (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          
          {user ? (
            <div className="flex items-center gap-4 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center gap-2 text-[11px] font-bold uppercase text-zinc-300 hover:text-white transition-colors cursor-pointer font-sans">
                <div className="bg-white text-black p-1 rounded-full">
                  <UserIcon size={14} strokeWidth={2.5} />
                </div>
                {user.name.split(' ')[0]}
              </Link>
              <div className="w-px h-4 bg-white/20"></div>
              <button 
                onClick={logoutUser} 
                className="text-[10px] uppercase font-bold text-red-500 hover:text-red-400 transition-colors cursor-pointer font-sans"
              >
                Quitter
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="text-xs uppercase font-bold tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer font-sans"
            >
              Connexion
            </Link>
          )}

          <button 
            onClick={() => setIsCartOpen(true)} 
            className="group relative p-2.5 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer text-white font-sans hover:-translate-y-0.5"
            aria-label="Ouvrir le panier"
          >
            <ShoppingBag size={24} strokeWidth={1.8} />
            {getItemCount() > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-sm transform group-hover:scale-110 transition-transform">
                {getItemCount()}
              </span>
            )}
          </button>
        </div>

      </nav>

      {/* Menu Mobile Accordion */}
      <div className={`lg:hidden bg-zinc-950 border-b border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col px-6 py-4 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm uppercase tracking-widest py-2 border-b border-white/5 ${
                location.pathname === link.path ? 'text-white font-black' : 'text-zinc-400 font-bold'
              } ${link.path === '/admin' ? 'text-red-500' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="pt-4 flex flex-col gap-4">
            {user ? (
              <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <Link to={user.role === 'admin' ? '/admin' : '/profile'} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-xs font-bold uppercase text-white">
                  <div className="bg-white text-black p-1.5 rounded-full">
                    <UserIcon size={16} strokeWidth={2.5} />
                  </div>
                  {user.name}
                </Link>
                <button onClick={() => { logoutUser(); setIsMobileMenuOpen(false); }} className="text-xs uppercase font-bold text-red-500">Quitter</button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center bg-white/10 text-white font-bold uppercase text-xs py-3 rounded-xl hover:bg-white/20 transition-colors">
                Connexion / Inscription
              </Link>
            )}
            <button 
              onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }} 
              className="w-full bg-white text-black font-black text-xs py-3.5 tracking-widest uppercase flex justify-center items-center gap-2 rounded-xl transition-transform hover:scale-[1.02]"
            >
              <ShoppingBag size={18} />
              PANIER ({getItemCount()})
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;