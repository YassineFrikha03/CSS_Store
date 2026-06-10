import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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

      alert('Votre compte CSS Store a été créé avec succès ! 🖤🤍');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-white font-sans text-left select-none items-stretch">
      
      {/* 🖤 CÔTÉ GAUCHE : VISUEL IMMERSIF ET LOGO OFFICIEL CSS AGRANDI (w-5/12) */}
      <div className="hidden md:flex md:w-5/12 bg-black text-white p-16 flex-col justify-between relative min-h-screen">
        <img src={imagelogin} alt="Image d'ambiance stade" className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale contrast-125 pointer-events-none" />

        <div className="z-10 flex items-center gap-5 border-b border-zinc-800 pb-6">
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
          
          <div className="space-y-3.5 pt-6 text-[11px] font-mono tracking-wide text-zinc-300 border-t border-zinc-900">
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

        <div className="z-10 text-[10px] font-mono tracking-widest text-zinc-600 font-black uppercase">
          Plus qu'un club, une légende.
        </div>
      </div>

      {/* ⚪ CÔTÉ DROIT : ZONE FORMULAIRE PREND TOUT L'ESPACE RESTANT (w-7/12) */}
      <div className="w-full md:w-7/12 flex items-center justify-center bg-white min-h-screen">
        {/* 🛠️ max-w-xl retiré et w-full appliqué pour occuper 100% de la largeur de droite */}
        <div className="w-full h-full flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12">
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black uppercase tracking-wider text-black font-sans">Créer un compte</h1>
            <p className="text-xs text-zinc-400 font-medium mt-1.5">Rejoignez la famille du Club Sportif Sfaxien</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] font-mono p-3 mb-5 font-bold">
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
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-2.5 outline-none transition-all rounded-none font-medium text-black" 
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
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-2.5 outline-none transition-all rounded-none font-medium text-black" 
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
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-2.5 outline-none transition-all rounded-none font-medium text-black" 
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
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-2.5 outline-none transition-all rounded-none font-medium text-black" 
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
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white px-4 py-2.5 outline-none transition-all rounded-none font-medium text-black" 
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
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white pl-4 pr-11 py-2.5 outline-none transition-all rounded-none font-medium text-black" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
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
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white pl-4 pr-11 py-2.5 outline-none transition-all rounded-none font-medium text-black" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION FACE ID */}
            <div className="pt-2 border-t border-zinc-100">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input 
                  type="checkbox" 
                  checked={enableFaceId}
                  onChange={(e) => {
                    setEnableFaceId(e.target.checked);
                    if (!e.target.checked) setFaceDescriptor(null);
                  }}
                  className="w-3.5 h-3.5 accent-black cursor-pointer"
                />
                <span className="text-[11px] font-bold text-black uppercase tracking-widest">Activer FaceID (Connexion Rapide)</span>
              </label>

              {enableFaceId && (
                <div className="mt-4 mb-6">
                  <FaceScanner 
                    mode="register" 
                    onScanSuccess={(descriptor) => setFaceDescriptor(descriptor)} 
                  />
                  {faceDescriptor && (
                    <p className="text-xs text-emerald-600 font-bold mt-2 text-center">Empreinte faciale sécurisée ✔</p>
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
                className="w-4 h-4 accent-black border-zinc-300 mt-0.5 cursor-pointer" 
              />
              <label htmlFor="terms" className="text-zinc-500 text-[11px] leading-snug cursor-pointer font-medium">
                J'accepte les <span className="text-black font-bold underline">Conditions Générales</span> et la <span className="text-black font-bold underline">Politique de Confidentialité</span> de la boutique officielle.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-4 font-black uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-colors cursor-pointer pt-4 rounded-none disabled:bg-zinc-400"
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-[11px] text-zinc-400 mt-6 font-medium">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-black font-black underline hover:text-zinc-600 ml-1">
              Se connecter
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;