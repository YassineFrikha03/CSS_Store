import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { loginUser } = useUser();

  // États de basculement et de formulaire
  const [isRegister, setIsRegister] = useState(false);
  const [identifier, setIdentifier] = useState('');
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
          email: identifier,
          password,
          phoneNumber,
          shippingAddress: {
            city: city,
            country: 'Tunisia'
          }
        });
        
        setIsRegister(false);
        setError('');
        toast.success("Compte créé avec succès ! Vous pouvez maintenant vous connecter. 🖤🤍");
      } else {
        // =========================================================================
        // 🔓 REQUÊTE DE CONNEXION BACKEND
        // =========================================================================
        const res = await axios.post('http://localhost:5000/api/users/login', { identifier, password });
        
        // Extraction sécurisée des données selon la structure du payload backend
        const userPayload = res.data.user || res.data;
        const tokenPayload = res.data.token;

        if (userPayload) {
          // 💾 persistence de la session dans le navigateur
          if (tokenPayload) sessionStorage.setItem('token', tokenPayload);
          sessionStorage.setItem('user', JSON.stringify(userPayload));

          // ⚡ Synchronisation globale de l'état de l'utilisateur
          loginUser(userPayload); 
          
          onClose();

          // Rediriger tout le monde vers l'accueil
          navigate('/');
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
      
      {/* Conteneur blanc minimaliste avec bords arrondis */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-zinc-100 p-8 text-black shadow-2xl rounded-3xl text-left z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Bouton de fermeture discret [X] */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-400 hover:text-black font-mono text-xs cursor-pointer transition-colors"
        >
          ✕
        </button>
        
        {/* Titre Principal de la Modale */}
        <h2 className="text-xl font-black uppercase tracking-wider text-center mb-8 font-sans">
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
                  className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-black focus:ring-4 focus:ring-black/5 focus:bg-white px-5 py-3.5 text-sm text-black outline-none transition-all rounded-xl font-medium" 
                />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
              {isRegister ? "Adresse E-mail" : "E-mail ou Numéro de téléphone"}
            </label>
            <input 
              type={isRegister ? "email" : "text"} 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              required 
              placeholder={isRegister ? "Ex: supporter@css.tn" : "Ex: supporter@css.tn ou 216..."}
              className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-black focus:ring-4 focus:ring-black/5 focus:bg-white px-5 py-3.5 text-sm text-black outline-none transition-all rounded-xl font-medium" 
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
              className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-black focus:ring-4 focus:ring-black/5 focus:bg-white px-5 py-3.5 text-sm text-black outline-none transition-all rounded-xl font-medium" 
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
                    className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-black focus:ring-4 focus:ring-black/5 focus:bg-white px-5 py-3.5 text-sm text-black outline-none transition-all rounded-xl font-medium" 
                  />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Ville (Tunisie)</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="Ex: Sfax"
                    className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-black focus:ring-4 focus:ring-black/5 focus:bg-white px-5 py-3.5 text-sm text-black outline-none transition-all rounded-xl font-medium" 
                  />
              </div>
            </div>
          )}

          {/* Bouton d'action principal */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white hover:bg-zinc-800 font-bold py-4 text-xs tracking-widest uppercase transition-all duration-300 mt-6 cursor-pointer rounded-xl disabled:bg-zinc-400 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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