import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Intégration future avec ton backend ou un service d'envoi
    console.log("Message envoyé :", formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="w-full bg-[#F9F9F9] min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* FIL D'ARIANE & TITRE */}
        <div className="text-zinc-400 text-[10px] uppercase font-mono tracking-widest mb-2">
          Accueil &gt; <span className="text-black font-bold">Contact</span>
        </div>
        
        <div className="border-b border-zinc-200 pb-4 mb-8">
          <h1 className="text-3xl font-black uppercase tracking-wider text-black">Contactez-nous</h1>
        </div>

        {/* DOUBLE COLUMN LAYOUT (Fidèle au Wireframe 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* =========================================================================
              COLONNE GAUCHE : COORDONNÉES & CARTE
              ========================================================================= */}
          <div className="flex flex-col gap-8 text-left select-none">
            
            {/* Les Coordonnées Officielles */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4">
                Nos Coordonnées
              </h3>
              <div className="space-y-4 text-xs font-medium text-zinc-800">
                <div className="flex items-start gap-3">
                  <span className="text-sm">📍</span>
                  <div>
                    <p className="font-bold text-black">Stade Taïeb Mhiri, Route de Gabès</p>
                    <p className="text-zinc-500 mt-0.5">3000 Sfax, Tunisie</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 border-t border-zinc-100 pt-3">
                  <span className="text-sm">📞</span>
                  <p className="font-bold text-black font-mono">+216 74 456 789</p>
                </div>

                <div className="flex items-center gap-3 border-t border-zinc-100 pt-3">
                  <span className="text-sm">✉️</span>
                  <p className="font-bold text-black font-mono">contact@css-store.tn</p>
                </div>

                <div className="flex items-start gap-3 border-t border-zinc-100 pt-3">
                  <span className="text-sm">🕒</span>
                  <div>
                    <p className="font-bold text-black">Lun - Ven : 9h30 - 17h30</p>
                    <p className="text-zinc-500 mt-0.5">Sam : 8h30 - 13h00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Réseaux Sociaux Suivez-nous */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-3">
                Suivez-nous
              </h4>
              <div className="flex gap-4 text-xs font-bold text-black">
                <span className="hover:underline cursor-pointer">Facebook</span>
                <span className="hover:underline cursor-pointer">Instagram</span>
                <span className="hover:underline cursor-pointer">TikTok</span>
              </div>
            </div>

            {/* Emplacement de la Carte (Simulé par un bloc épuré ou un iframe) */}
            <div className="w-full h-52 border border-zinc-200 bg-zinc-100 relative overflow-hidden flex items-center justify-center">
              {/* Utilisation d'un iframe OpenStreetMap ou Google Maps stylisé en niveaux de gris */}
              <iframe 
                title="Carte Stade Taïeb Mhiri"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1m0!2m1!1s0x13023223023df3ab%3A0x7d0a623193e839ea!2sStade+Ta%C3%AFeb+Mhiri!5m2!1sfr!2stn"
                className="w-full h-full border-none filter grayscale contrast-110 opacity-80"
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>

          </div>

          {/* =========================================================================
              COLONNE DROITE : FORMULAIRE ENVOYEZ-NOUS UN MESSAGE
              ========================================================================= */}
          <div className="bg-white border border-zinc-200 p-8 text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-100 pb-3 mb-6">
              Envoyez-nous un message
            </h3>

            {submitted && (
              <div className="bg-zinc-900 text-white text-xs font-bold px-4 py-3 mb-6 tracking-wide font-sans text-center uppercase">
                🖤🤍 Votre message a été transmis avec succès au secrétariat du club.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Nom complet</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Yassine Frikha"
                    className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-xs text-black font-medium outline-none focus:border-black transition-colors rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Ex: support@domaine.tn"
                    className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-xs text-black font-medium outline-none focus:border-black transition-colors rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Sujet</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Ex: Demande de flocage personnalisé"
                  className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-xs text-black font-medium outline-none focus:border-black transition-colors rounded-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Votre message</label>
                <textarea 
                  rows="5"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Écrivez vos remarques ou questions ici..."
                  className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-xs text-black font-medium outline-none focus:border-black transition-colors rounded-none resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white hover:bg-zinc-800 font-bold py-3.5 text-[10px] tracking-widest transition-all duration-300 uppercase cursor-pointer rounded-none"
              >
                Envoyer le message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;