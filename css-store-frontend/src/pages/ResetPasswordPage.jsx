import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import imagelogin from '../assets/imagelogin.png';
import Logo from '../assets/logocss.png';

// 👁️ Icônes SVG pour afficher/masquer le mot de passe
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      // Appel à la nouvelle route Backend que nous venons de créer
      const res = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { password });
      
      setSuccess(res.data.message || "Mot de passe réinitialisé avec succès ! 🖤🤍");
      setTimeout(() => {
        navigate('/login'); // Redirection automatique vers la page de connexion après 3 secondes
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Le lien est invalide ou a expiré.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-zinc-950 font-sans text-left select-none items-stretch">
      
      {/* 🖤 CÔTÉ GAUCHE : IDENTIQUE AU DESIGN D'AUTHENTIFICATION (w-5/12) */}
      <div className="hidden md:flex md:w-5/12 bg-black text-white p-16 flex-col justify-between relative min-h-screen">
        <img src={imagelogin} alt="Image de connexion" className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale contrast-125 pointer-events-none mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 pointer-events-none"></div>

        <div className="z-10 flex items-center gap-5 border-b border-white/10 pb-6">
          <img 
            src={Logo} 
            alt="Logo du Club Sportif Sfaxien" 
            className="w-24 h-24 object-contain filter drop-shadow-[0_4px_6px_rgba(255,255,255,0.1)]" 
          />
          <div>
            <h2 className="font-black text-xs uppercase tracking-widest text-zinc-400">Sécurité Compte</h2>
            <h1 className="font-black text-sm uppercase tracking-tight text-white -mt-0.5">Club Sportif Sfaxien</h1>
          </div>
        </div>

        <div className="z-10 space-y-6 my-auto max-w-sm">
          <h2 className="text-4xl font-black uppercase tracking-tight leading-none text-white">
            Nouveau <br />Départ.
          </h2>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">
            Configurez un mot de passe robuste pour protéger vos données personnelles, vos favoris et vos commandes sur la boutique officielle.
          </p>
        </div>

        <div className="z-10 text-[10px] font-mono tracking-widest text-zinc-600 font-black uppercase">
          Plus qu'un club, une légende.
        </div>
      </div>

      {/* ⚪ CÔTÉ DROIT : ZONE FORMULAIRE PREND TOUT L'ESPACE RESTANT (w-7/12) */}
      <div className="w-full md:w-7/12 flex items-center justify-center bg-zinc-950 min-h-screen relative overflow-hidden">
        {/* Lueur de fond décorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full h-full flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 z-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-wider text-white font-sans">Nouveau mot de passe</h1>
            <p className="text-xs text-zinc-400 font-medium mt-1.5">Saisissez vos nouveaux identifiants de sécurité</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono p-3 mb-6 font-bold rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono p-3 mb-6 font-bold rounded-lg👁️">
              🎉 {success} (Redirection vers la page de connexion...)
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-medium w-full">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Nouveau mot de passe</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                  autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 focus:border-white focus:bg-white/10 pl-5 pr-11 py-3.5 text-sm text-white outline-none transition-all rounded-xl font-medium placeholder-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                  autoComplete="new-password"
                  className="w-full bg-white/5 border border-white/10 focus:border-white focus:bg-white/10 pl-5 pr-11 py-3.5 text-sm text-white outline-none transition-all rounded-xl font-medium placeholder-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || success}
              className="w-full bg-white text-black py-4 font-black uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer rounded-xl disabled:bg-zinc-600 disabled:text-zinc-400 border-none mt-2"
            >
              {loading ? "Enregistrement..." : "Mettre à jour le mot de passe"}
            </button>
          </form>

          <p className="text-center text-[11px] text-zinc-400 mt-8 font-medium">
            Retourner à la{' '}
            <Link to="/login" className="text-white font-black underline hover:text-zinc-300 ml-1">
              page de connexion
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;