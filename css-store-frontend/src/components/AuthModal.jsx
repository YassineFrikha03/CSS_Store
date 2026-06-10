import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { loginUser } = useUser();

  // États de basculement et de formulaire
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // =========================================================================
        // 📝 REQUÊTE D'INSCRIPTION BACKEND
        // =========================================================================
        await axios.post('http://localhost:5000/api/users/register', {
          name,
          email,
          password,
          phoneNumber,
          shippingAddress: {
            city: city,
            country: 'Tunisia'
          }
        });
        
        setIsRegister(false);
        setError('');
        alert("Compte créé avec succès ! Vous pouvez maintenant vous connecter. 🖤🤍");
      } else {
        // =========================================================================
        // 🔓 REQUÊTE DE CONNEXION BACKEND
        // =========================================================================
        const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
        
        // Extraction sécurisée des données selon la structure du payload backend
        const userPayload = res.data.user || res.data;
        const tokenPayload = res.data.token;

        if (userPayload) {
          // 💾 persistence de la session dans le navigateur
          if (tokenPayload) localStorage.setItem('token', tokenPayload);
          localStorage.setItem('user', JSON.stringify(userPayload));

          // ⚡ Synchronisation globale de l'état de l'utilisateur
          loginUser(userPayload); 
          
          onClose();

          // Aiguillage automatique si l'utilisateur possède les privilèges d'administration
          if (userPayload.role === 'admin') {
            navigate('/admin');
          } else {
            // Optionnel : recharge la fenêtre pour forcer la mise à jour des composants distants
            window.location.reload();
          }
        } else {
          setError("Impossible de charger le profil utilisateur.");
        }
      }
    } catch (err) {
      console.error("Erreur d'authentification modale :", err);
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'authentification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Arrière-plan flouté sombre transparent */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Conteneur blanc minimaliste (Fidèle à la maquette) */}
      <div className="relative w-full max-w-md bg-white border border-zinc-200 p-8 text-black shadow-2xl rounded-none text-left z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Bouton de fermeture discret [X] */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-black font-mono text-xs cursor-pointer transition-colors"
        >
          ✕
        </button>
        
        {/* Titre Principal de la Modale */}
        <h2 className="text-sm font-black uppercase tracking-widest text-center mb-8 font-sans">
          {isRegister ? "Rejoindre le Club" : "Espace Supporter"}
        </h2>

        {/* Message d'erreur dynamique */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] p-3 mb-6 font-medium font-mono">
            ⚠️ {error}
          </div>
        )}

        {/* Formulaire Synchrone */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Nom Complet</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="Ex: Yassine Frikha"
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-3 text-xs text-black outline-none transition-all rounded-none font-medium" 
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Adresse E-mail</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Ex: supporter@css.tn"
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-3 text-xs text-black outline-none transition-all rounded-none font-medium" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-3 text-xs text-black outline-none transition-all rounded-none font-medium" 
            />
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Téléphone</label>
                <input 
                  type="text" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  placeholder="216..."
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-3 text-xs text-black outline-none transition-all rounded-none font-medium" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Ville (Tunisie)</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="Ex: Sfax"
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-3 text-xs text-black outline-none transition-all rounded-none font-medium" 
                />
              </div>
            </div>
          )}

          {/* Bouton d'action principal */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white hover:bg-zinc-800 font-bold py-3.5 text-xs tracking-widest uppercase transition-all duration-300 mt-6 cursor-pointer rounded-none disabled:bg-zinc-400"
          >
            {loading ? "Vérification..." : isRegister ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>

        {/* Pied de modale : Basculement Inscription / Connexion */}
        <p className="text-center text-xs text-zinc-400 mt-8 font-medium">
          {isRegister ? "Déjà membre ?" : "Nouveau supporter ?"} {' '}
          <button 
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }} 
            className="text-black font-bold underline ml-1 hover:text-zinc-600 cursor-pointer bg-transparent border-none p-0"
          >
            {isRegister ? "Se connecter" : "Créer un compte"}
          </button>
        </p>

      </div>
    </div>
  );
};

export default AuthModal;