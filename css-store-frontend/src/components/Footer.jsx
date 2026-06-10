import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logocss.png';

const Footer = () => {
  return (
    <footer className="bg-black text-zinc-400 text-xs py-12 border-t border-zinc-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 1. Colonne Identité & Réseaux Sociaux */}
        <div className="text-left flex flex-col justify-between h-full min-h-[140px]">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={Logo} alt="CSS Logo" className="w-10 h-10 object-contain" />
              <div className="font-black text-xs md:text-sm text-white tracking-widest leading-tight">
                CLUB SPORTIF <br /> SFAXIEN
              </div>
            </Link>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Boutique officielle du Club Sportif Sfaxien. Portez haut les couleurs noir et blanc !
            </p>
          </div>
          
          {/* Les icônes de réseaux sociaux calquées sur la maquette */}
          <div className="flex items-center gap-4 mt-6 text-zinc-500">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-sm">🎦</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-sm">📸</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-sm">▶️</a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-sm">🎵</a>
          </div>
        </div>
        
        {/* 2. Links de routage : BOUTIQUE */}
        <div className="text-left">
          <h4 className="text-white font-black uppercase tracking-wider mb-4 text-[11px]">Boutique</h4>
          <ul className="space-y-2.5 text-[11px]">
            <li>
              <Link to="/textiles" className="hover:text-white transition-colors">Maillots</Link>
            </li>
            <li>
              <Link to="/accessoires" className="hover:text-white transition-colors">Accessoires</Link>
            </li>
            <li>
              <Link to="/accessoires" className="hover:text-white transition-colors">Écharpes</Link>
            </li>
            <li>
              <Link to="/accessoires" className="hover:text-white transition-colors">Casquettes</Link>
            </li>
          </ul>
        </div>

        {/* 3. Links de routage : INFOS PRATIQUES */}
        <div className="text-left">
          <h4 className="text-white font-black uppercase tracking-wider mb-4 text-[11px]">Infos Pratiques</h4>
          <ul className="space-y-2.5 text-[11px]">
            <li>
              <Link to="/a-propos" className="hover:text-white transition-colors">Livraison</Link>
            </li>
            <li>
              <Link to="/a-propos" className="hover:text-white transition-colors">Paiement</Link>
            </li>
            <li>
              <Link to="/a-propos" className="hover:text-white transition-colors">Retours & Échanges</Link>
            </li>
            <li>
              <Link to="/a-propos" className="hover:text-white transition-colors">CGV</Link>
            </li>
          </ul>
        </div>

        {/* 4. Bloc Statique : CONTACT */}
        <div className="text-left">
          <h4 className="text-white font-black uppercase tracking-wider mb-4 text-[11px]">Contact</h4>
          <ul className="space-y-2.5 text-[11px] text-zinc-400 font-mono">
            <li className="flex items-start gap-2">
              <span>📍</span> 
              <span>Stade Taïeb Mhiri, Route de Gabès, Sfax</span>
            </li>
            <li className="flex items-center gap-2">
              <span>📞</span> 
              <span>+216 74 456 789</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✉️</span> 
              <span className="hover:text-white transition-colors cursor-pointer">contact@css-store.tn</span>
            </li>
          </ul>
        </div>

      </div>
      
      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-600 tracking-wider">
        © 2026 Club Sportif Sfaxien Store. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;