import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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

const RegisterPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // FaceID
  const [enableFaceId, setEnableFaceId] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!agreeTerms) {
      setError('Veuillez accepter les conditions générales.');
      return;
    }

    if (enableFaceId && !faceDescriptor) {
      setError('Vous avez activé FaceID mais n\'avez pas scanné votre visage.');
      return;
    }

    setLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await axios.post('http://localhost:5000/api/users/register', {
        name: fullName,
        email,
        password,
        phoneNumber,
        shippingAddress: { city, country: 'Tunisia' },
        hasFaceId: enableFaceId,
        faceDescriptor: faceDescriptor ? Array.from(faceDescriptor) : []
      });

      toast.success('Votre compte CSS Store a été créé avec succès ! 🖤🤍');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-zinc-950 font-sans text-left select-none items-stretch">
      
      {/* 🖤 CÔTÉ GAUCHE : VISUEL IMMERSIF ET LOGO OFFICIEL CSS AGRANDI (w-5/12) */}
      <div className="hidden md:flex md:w-5/12 bg-black text-white p-16 flex-col justify-between relative min-h-screen">
        <img src={imagelogin} alt="Image d'ambiance stade" className="absolute inset-0 w-full h-full object-cover opacity-30 filter grayscale contrast-125 pointer-events-none mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 pointer-events-none"></div>

        <div className="z-10 flex items-center gap-5 border-b border-white/10 pb-6">
          <img 
            src={Logo} 
            alt="Logo du Club Sportif Sfaxien" 
            className="w-24 h-24 object-contain filter drop-shadow-[0_4px_6px_rgba(255,255,255,0.1)]" 
          />
          <div>
            <h2 className="font-black text-xs uppercase tracking-widest text-zinc-400">Rejoindre la famille</h2>
            <h1 className="font-black text-sm uppercase tracking-tight text-white -mt-0.5">Club Sportif Sfaxien</h1>
          </div>
        </div>

        <div className="z-10 space-y-6 my-auto max-w-sm">
          <h2 className="text-4xl font-black uppercase tracking-tight leading-none text-white">
            REJOIGNEZ LA <br />FAMILLE CSS
          </h2>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed">
            Créez votre compte et profitez d'une expérience exclusive sur notre boutique officielle.
          </p>
          
          <div className="space-y-3.5 pt-6 text-[11px] font-mono tracking-wide text-zinc-300 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">⭐</span> <span>Offres et promotions exclusives</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">📦</span> <span>Accès rapide à vos commandes</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">❤️</span> <span>Enregistrez vos produits favoris</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500">🇹🇳</span> <span>Livraison rapide partout en Tunisie</span>
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
          
          <div className="text-center mb-6">
            <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-wider text-white font-sans mb-3">Créer un compte</h1>
            <p className="text-sm text-zinc-400 font-medium">Rejoignez la famille du Club Sportif Sfaxien</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono p-3 mb-5 font-bold rounded-lg">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium w-full">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Prénom</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)} 
                    placeholder="Votre prénom" 
                    required 
                    autoComplete="given-name" 
                    className="w-full bg-white/5 border border-white/10 focus:border-white focus:bg-white/10 px-5 py-3 text-sm outline-none transition-all rounded-xl font-medium text-white placeholder-zinc-600" 
                  />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Nom</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)} 
                    placeholder="Votre nom" 
                    required 
                    autoComplete="family-name" 
                    className="w-full bg-white/5 border border-white/10 focus:border-white focus:bg-white/10 px-5 py-3 text-sm outline-none transition-all rounded-xl font-medium text-white placeholder-zinc-600" 
                  />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Adresse e-mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Entrez votre e-mail" 
                required 
                autoComplete="email" 
                className="w-full bg-white/5 border border-white/10 focus:border-white focus:bg-white/10 px-5 py-3 text-sm outline-none transition-all rounded-xl font-medium text-white placeholder-zinc-600" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Téléphone</label>
                  <input 
                    type="tel" 
                    value={phoneNumber} 
                    onChange={e => setPhoneNumber(e.target.value)} 
                    placeholder="+216 XX XXX XXX" 
                    required 
                    autoComplete="tel" 
                    className="w-full bg-white/5 border border-white/10 focus:border-white focus:bg-white/10 px-5 py-3 text-sm outline-none transition-all rounded-xl font-medium text-white placeholder-zinc-600" 
                  />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Ville (Tunisie)</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={e => setCity(e.target.value)} 
                    placeholder="Ex: Sfax, Tunis, Sousse..." 
                    required 
                    className="w-full bg-white/5 border border-white/10 focus:border-white focus:bg-white/10 px-5 py-3 text-sm outline-none transition-all rounded-xl font-medium text-white placeholder-zinc-600" 
                  />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Mot de passe</label>
                <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="Créez un mot de passe" 
                      required 
                      autoComplete="new-password" 
                      className="w-full bg-white/5 border border-white/10 focus:border-white focus:bg-white/10 pl-5 pr-11 py-3 text-sm outline-none transition-all rounded-xl font-medium text-white placeholder-zinc-600" 
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
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">Confirmer le mot de passe</label>
                <div className="relative">
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      placeholder="Confirmez votre mot de passe" 
                      required 
                      autoComplete="new-password" 
                      className="w-full bg-white/5 border border-white/10 focus:border-white focus:bg-white/10 pl-5 pr-11 py-3 text-sm outline-none transition-all rounded-xl font-medium text-white placeholder-zinc-600" 
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
            </div>

            {/* SECTION FACE ID */}
            <div className="pt-2 border-t border-white/10">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input 
                  type="checkbox" 
                  checked={enableFaceId}
                  onChange={(e) => {
                    setEnableFaceId(e.target.checked);
                    if (!e.target.checked) setFaceDescriptor(null);
                  }}
                  className="w-4 h-4 accent-white cursor-pointer rounded border-zinc-700 bg-zinc-900"
                />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Activer FaceID (Connexion Rapide)</span>
              </label>

              {enableFaceId && (
                <div className="mt-4 mb-6">
                  <FaceScanner 
                    mode="register" 
                    onScanSuccess={(descriptor) => setFaceDescriptor(descriptor)} 
                  />
                  {faceDescriptor && (
                    <p className="text-xs text-emerald-400 font-bold mt-2 text-center">Empreinte faciale sécurisée ✔</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                id="terms" 
                checked={agreeTerms} 
                onChange={e => setAgreeTerms(e.target.checked)} 
                className="w-4 h-4 accent-white border-zinc-700 bg-zinc-900 mt-0.5 cursor-pointer rounded" 
              />
              <label htmlFor="terms" className="text-zinc-400 text-xs leading-snug cursor-pointer font-medium">
                J'accepte les <span className="text-white font-bold underline">Conditions Générales</span> et la <span className="text-white font-bold underline">Politique de Confidentialité</span> de la boutique officielle.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black py-4 font-black uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all cursor-pointer rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:bg-zinc-600 disabled:text-zinc-400 mt-2 border-none"
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-[11px] text-zinc-400 mt-6 font-medium">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-white font-black underline hover:text-zinc-300 ml-1">
              Se connecter
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;