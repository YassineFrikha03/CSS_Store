import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Music } from 'lucide-react';
import Logo from '../assets/logocss.png';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 text-xs pt-16 pb-8 border-t border-white/10 font-sans mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
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
          
          {/* Les icônes de réseaux sociaux */}
          <div className="flex items-center gap-4 mt-6 text-zinc-500">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white hover:-translate-y-1 transition-all duration-300 bg-zinc-900/50 p-2.5 rounded-full border border-zinc-800 hover:border-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white hover:-translate-y-1 transition-all duration-300 bg-zinc-900/50 p-2.5 rounded-full border border-zinc-800 hover:border-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white hover:-translate-y-1 transition-all duration-300 bg-zinc-900/50 p-2.5 rounded-full border border-zinc-800 hover:border-zinc-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-white hover:-translate-y-1 transition-all duration-300 bg-zinc-900/50 p-2.5 rounded-full border border-zinc-800 hover:border-zinc-600">
              <Music size={18} strokeWidth={2} />
            </a>
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
          <h4 className="text-white font-black uppercase tracking-wider mb-5 text-[11px] lg:text-xs">Contact</h4>
          <ul className="space-y-4 text-[11px] lg:text-xs text-zinc-400">
            <li className="flex items-start gap-3 group">
              <MapPin size={16} className="text-zinc-600 group-hover:text-white transition-colors shrink-0 mt-0.5" /> 
              <span className="leading-relaxed">Stade Taïeb Mhiri, Route de Gabès,<br/>Sfax, Tunisie</span>
            </li>
            <li className="flex items-center gap-3 group">
              <Phone size={16} className="text-zinc-600 group-hover:text-white transition-colors shrink-0" /> 
              <span className="font-mono tracking-wider">+216 74 456 789</span>
            </li>
            <li className="flex items-center gap-3 group">
              <Mail size={16} className="text-zinc-600 group-hover:text-white transition-colors shrink-0" /> 
              <a href="mailto:contact@css-store.tn" className="hover:text-white transition-colors cursor-pointer">contact@css-store.tn</a>
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