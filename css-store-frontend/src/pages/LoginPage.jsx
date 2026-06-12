import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';
import imagelogin from '../assets/imagelogin.png';
import Logo from '../assets/logocss.png';
import FaceScanner from '../components/FaceScanner';

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

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useUser();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // FaceID States
  const [step, setStep] = useState('login'); // 'login' ou 'face_scan'
  const [pendingUserId, setPendingUserId] = useState(null);


  // =========================================================================
  // 🔐 CONNEXION STANDARD (E-MAIL / MOT DE PASSE)
  // =========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { identifier, password });
      
      // Si FaceID est requis
      if (res.data.requireFaceId) {
        setPendingUserId(res.data.userId);
        setStep('face_scan');
        setLoading(false);
        return;
      }

      const userPayload = res.data.user || res.data;
      const tokenPayload = res.data.token;

      if (userPayload) {
        if (tokenPayload) sessionStorage.setItem('token', tokenPayload);
        sessionStorage.setItem('user', JSON.stringify(userPayload));
        loginUser(userPayload);

        // Rediriger tout le monde vers l'accueil
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Identifiants invalides");
    } finally {
      if (step === 'login') setLoading(false);
    }
  };

  const handleFaceScanSuccess = async (descriptor) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/verify-face', {
        userId: pendingUserId,
        faceDescriptor: descriptor
      });

      const userPayload = res.data.user;
      const tokenPayload = res.data.token;

      if (userPayload) {
        if (tokenPayload) sessionStorage.setItem('token', tokenPayload);
        sessionStorage.setItem('user', JSON.stringify(userPayload));
        loginUser(userPayload);

        // Rediriger tout le monde vers l'accueil
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Échec de l'authentification faciale.");
      setStep('login'); // Retour au login en cas d'échec
    }
  };

  // =========================================================================
  // 📨 GESTION DU MOT DE PASSE OUBLIÉ (INTERACTIF AVEC LE BACKEND)
  // =========================================================================
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');

    let targetIdentifier = identifier;
    if (!targetIdentifier) {
      const userInput = window.prompt("Veuillez saisir votre e-mail ou numéro de téléphone pour recevoir le lien de réinitialisation :");
      if (!userInput) return; // Annulé par l'utilisateur
      targetIdentifier = userInput;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/forgot-password', { identifier: targetIdentifier });
      toast.success(res.data.message || "Un e-mail ou SMS de récupération vous a été envoyé ! 📩📱");
      
      // Simulation visuelle du SMS
      if (res.data.simulatedSmsLink) {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-in fade-in slide-in-from-top-4' : 'animate-out fade-out slide-out-to-top-4'} max-w-sm w-full bg-zinc-900/90 backdrop-blur-xl shadow-2xl rounded-3xl pointer-events-auto border border-white/10 p-5 flex flex-col gap-3 duration-300 text-white`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-[#25D366] w-6 h-6 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
                </div>
                <span className="font-black uppercase tracking-wider text-[10px] text-zinc-400">Messages</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500">À l'instant</span>
            </div>
            
            <div>
              <h4 className="font-black text-sm uppercase tracking-tight text-white mb-1">Club Sportif Sfaxien</h4>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                Vous avez demandé la réinitialisation de votre mot de passe. Cliquez ci-dessous pour le changer.
              </p>
            </div>

            <div className="flex gap-2 mt-2">
              <a 
                href={res.data.simulatedSmsLink} 
                onClick={() => toast.dismiss(t.id)}
                className="flex-1 bg-white text-black py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-zinc-200 transition-colors shadow-lg flex items-center justify-center"
              >
                Modifier
              </a>
              <button 
                onClick={() => toast.dismiss(t.id)}
                className="bg-white/10 text-white hover:bg-white/20 py-3 px-4 rounded-xl text-[10px] font-black uppercase transition-colors border border-white/10"
              >
                Fermer
              </button>
            </div>
          </div>
        ), { duration: 15000 }); // Affiché 15s pour avoir le temps de cliquer
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi de l'e-mail de récupération.");
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
    <div className="w-full min-h-screen flex bg-zinc-950 font-sans text-left select-none items-stretch">
      
      {/* 🖤 CÔTÉ GAUCHE : VISUEL IMMERSIF STADE (w-5/12) */}
      <div className="hidden md:flex md:w-5/12 bg-black text-white p-16 flex-col justify-between relative min-h-screen">
        <img src={imagelogin} alt="Image de connexion" className="absolute inset-0 w-full h-full object-cover opacity-30 filter grayscale contrast-125 pointer-events-none mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 pointer-events-none"></div>

        <div className="z-10 flex items-center gap-5 border-b border-white/10 pb-6">
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
          
          <div className="space-y-3.5 pt-6 text-[11px] font-mono tracking-wide text-zinc-300 border-t border-white/10">
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

        <div className="z-10 text-[10px] font-mono tracking-widest text-zinc-500 font-black uppercase">
          Plus qu'un club, une légende.
        </div>
      </div>

      {/* ⚪ CÔTÉ DROIT : ZONE FORMULAIRE PREND TOUT L'ESPACE RESTANT (w-7/12) */}
      <div className="w-full md:w-7/12 flex items-center justify-center bg-zinc-950 min-h-screen relative overflow-hidden">
        {/* Lueur de fond décorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full h-full flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 z-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-wider text-white font-sans mb-3">
              {step === 'login' ? 'Connexion' : 'Sécurité FaceID'}
            </h1>
            <p className="text-sm text-zinc-400 font-medium">
              {step === 'login' ? 'Accédez à votre compte supporter' : 'Veuillez confirmer votre identité'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono p-3 mb-6 font-bold rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {step === 'login' ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-5 text-xs font-medium w-full">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">E-mail ou Numéro de téléphone</label>
                  <input 
                    type="text" 
                    value={identifier} 
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Ex: supporter@css.tn ou 216..." 
                    required 
                    autoComplete="username"
                    className="w-full bg-white/5 border border-white/10 focus:border-white focus:bg-white/10 px-5 py-3.5 text-sm text-white outline-none transition-all rounded-xl font-medium placeholder-zinc-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400">Mot de passe</label>
                    <button 
                      type="button" 
                      onClick={handleForgotPassword}
                      className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full bg-white/5 border border-white/10 focus:border-white focus:bg-white/10 pl-5 pr-11 py-3.5 text-sm text-white outline-none transition-all rounded-xl font-medium placeholder-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 accent-white cursor-pointer border-zinc-700 bg-zinc-900 rounded" />
                  <label htmlFor="remember" className="text-zinc-400 text-xs cursor-pointer font-medium">Se souvenir de moi</label>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-white text-black py-4 font-black uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer rounded-xl disabled:bg-zinc-600 disabled:text-zinc-400 border-none mt-2"
                >
                  {loading ? "Vérification..." : "Se connecter"}
                </button>
              </form>

              <div className="relative my-8 text-center w-full">
                <hr className="border-white/10" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-950 px-4 font-mono text-[10px] text-zinc-500 font-bold">OU</span>
              </div>

              <div className="space-y-2.5 text-[11px] font-bold w-full">
                <button 
                  type="button" 
                  onClick={() => {
                    setPendingUserId(null);
                    setStep('face_scan');
                  }}
                  className="w-full border border-white/10 bg-white/5 py-3.5 px-4 flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all shadow-sm cursor-pointer text-white rounded-xl font-bold group"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v2m10-4h4a2 2 0 012 2v2M4 16v2a2 2 0 002 2h4m10-4v2a2 2 0 01-2 2h-4m-4-6a3 3 0 100-6 3 3 0 000 6z"></path>
                  </svg>
                  <span>Connexion directe avec FaceID</span>
                </button>

                <button 
                  type="button" 
                  onClick={handleGoogleLogin}
                  className="w-full border border-white/10 bg-white/5 py-3.5 px-4 flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all shadow-sm cursor-pointer text-white rounded-xl font-bold group"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continuer avec Google</span>
                </button>

                <div className="relative w-full">
                  <button 
                    type="button" 
                    disabled
                    className="w-full border border-white/5 bg-white/5 py-3.5 px-4 flex items-center justify-center gap-3 text-zinc-600 rounded-xl font-bold cursor-not-allowed select-none opacity-50"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#d4d4d8"/>
                    </svg>
                    <span>Continuer avec Facebook</span>
                  </button>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-white/10 px-2 py-0.5 rounded-sm">
                    Bientôt
                  </span>
                </div>
              </div>

              <p className="text-center text-[11px] text-zinc-400 mt-8 font-medium">
                Vous n'avez pas de compte ?{' '}
                <Link to="/register" className="text-white font-black underline hover:text-zinc-300 ml-1">
                  Créer un compte
                </Link>
              </p>
            </>
          ) : (
            <div className="w-full flex flex-col items-center animate-fade-in text-white">
              <FaceScanner mode="login" onScanSuccess={handleFaceScanSuccess} />
              
              <button 
                onClick={() => setStep('login')}
                className="mt-6 text-xs text-zinc-400 hover:text-white transition-colors underline cursor-pointer"
              >
                Annuler et utiliser le mot de passe uniquement
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginPage;