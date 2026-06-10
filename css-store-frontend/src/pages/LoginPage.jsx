import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import imagelogin from '../assets/imagelogin.png';
import Logo from '../assets/logocss.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // =========================================================================
  // 🔐 CONNEXION STANDARD (E-MAIL / MOT DE PASSE)
  // =========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const userPayload = res.data.user || res.data;
      const tokenPayload = res.data.token;

      if (userPayload) {
        if (tokenPayload) localStorage.setItem('token', tokenPayload);
        localStorage.setItem('user', JSON.stringify(userPayload));
        loginUser(userPayload);

        if (userPayload.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
          window.location.reload();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // 📨 GESTION DU MOT DE PASSE OUBLIÉ (INTERACTIF AVEC LE BACKEND)
  // =========================================================================
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      alert("Veuillez saisir votre adresse e-mail dans le champ pour recevoir le lien de réinitialisation.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      alert(res.data.message || "Un e-mail de récupération vous a été envoyé ! 📩");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'envoi de l'e-mail de récupération.");
    }
  };

  // =========================================================================
  // 🌐 AUTHENTIFICATION SOCIALE (CORRIGÉE AVEC LE PRÉFIXE /api/users)
  // =========================================================================
  const handleGoogleLogin = () => {
    // 🟢 Modifié : ajout de /users pour s'aligner sur les routes de ton backend
    window.open("http://localhost:5000/api/users/auth/google", "_self");
  };

  const handleFacebookLogin = () => {
    // 🟢 Modifié : ajout de /users pour s'aligner sur les routes de ton backend
    window.open("http://localhost:5000/api/users/auth/facebook", "_self");
  };

  return (
    <div className="w-full min-h-screen flex bg-white font-sans text-left select-none items-stretch">
      
      {/* 🖤 CÔTÉ GAUCHE : VISUEL IMMERSIF STADE (w-5/12) */}
      <div className="hidden md:flex md:w-5/12 bg-black text-white p-16 flex-col justify-between relative min-h-screen">
        <img src={imagelogin} alt="Image de connexion" className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale contrast-125 pointer-events-none" />

        <div className="z-10 flex items-center gap-5 border-b border-zinc-800 pb-6">
          <img 
            src={Logo} 
            alt="Logo du Club Sportif Sfaxien" 
            className="w-24 h-24 object-contain filter drop-shadow-[0_4px_6px_rgba(255,255,255,0.1)]" 
          />
          <div>
            <h2 className="font-black text-xs uppercase tracking-widest text-zinc-400">Boutique Officielle</h2>
            <h1 className="font-black text-sm uppercase tracking-tight text-white -mt-0.5">Club Sportif Sfaxien</h1>
          </div>
        </div>

        <div className="z-10 space-y-6 my-auto max-w-sm">
          <h2 className="text-4xl font-black uppercase tracking-tight leading-none text-white">
            Bienvenue <br />de retour !
          </h2>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">
            Connectez-vous pour continuer votre expérience avec le Club Sportif Sfaxien et accéder à votre espace personnalisé.
          </p>
          
          <div className="space-y-3.5 pt-6 text-[11px] font-mono tracking-wide text-zinc-300 border-t border-zinc-900">
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">🛡️</span> <span className="font-medium">Paiement 100% sécurisé</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">📦</span> <span className="font-medium">Suivi de commande en temps réel</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">🖤</span> <span className="font-medium">Vos favoris & historique</span>
            </div>
          </div>
        </div>

        <div className="z-10 text-[10px] font-mono tracking-widest text-zinc-600 font-black uppercase">
          Plus qu'un club, une légende.
        </div>
      </div>

      {/* ⚪ CÔTÉ DROIT : ZONE FORMULAIRE PREND TOUT L'ESPACE RESTANT (w-7/12) */}
      <div className="w-full md:w-7/12 flex items-center justify-center bg-white min-h-screen">
        <div className="w-full h-full flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-wider text-black font-sans">Connexion</h1>
            <p className="text-xs text-zinc-400 font-medium mt-1.5">Accédez à votre compte supporter</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] font-mono p-3 mb-6 font-bold">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-medium w-full">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">Adresse e-mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: supporter@css.tn" 
                required 
                autoComplete="email"
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-3.5 text-xs text-black outline-none transition-all rounded-none font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400">Mot de passe</label>
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-[10px] font-bold text-zinc-400 hover:text-black transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
                autoComplete="current-password"
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-3.5 text-xs text-black outline-none transition-all rounded-none font-medium"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="remember" className="w-4 h-4 accent-black cursor-pointer border-zinc-300" />
              <label htmlFor="remember" className="text-zinc-500 text-[11px] cursor-pointer font-medium">Se souvenir de moi</label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-4 font-black uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-colors cursor-pointer pt-4 rounded-none disabled:bg-zinc-400 border-none"
            >
              {loading ? "Vérification..." : "Se connecter"}
            </button>
          </form>

          <div className="relative my-8 text-center w-full">
            <hr className="border-zinc-200" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 font-mono text-[10px] text-zinc-400 font-bold">OU</span>
          </div>

          <div className="space-y-2.5 text-[11px] font-bold w-full">
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full border border-zinc-200 bg-white py-3.5 px-4 flex items-center justify-center gap-3 hover:bg-zinc-50 transition-colors cursor-pointer text-zinc-700 rounded-none font-bold"
            >
              🌐 Continuer avec Google
            </button>
            <div className="relative w-full">
              <button 
                type="button" 
                disabled
                className="w-full border border-zinc-100 bg-zinc-50 py-3.5 px-4 flex items-center justify-center gap-3 text-zinc-300 rounded-none font-bold cursor-not-allowed select-none"
              >
                🔵 Continuer avec Facebook
              </button>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-zinc-300 bg-zinc-100 px-2 py-0.5 rounded-sm">
                Bientôt
              </span>
            </div>
          </div>


          <p className="text-center text-[11px] text-zinc-400 mt-8 font-medium">
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="text-black font-black underline hover:text-zinc-600 ml-1">
              Créer un compte
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;