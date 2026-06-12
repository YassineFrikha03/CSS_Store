import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { ChevronLeft, Truck, CreditCard, ShieldCheck, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, checkoutCart, clearCart } = useCart();
  const { user } = useUser();

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: user?.phoneNumber || '',
    address: user?.shippingAddress?.address || '',
    city: user?.shippingAddress?.city || 'Sfax',
    zipCode: user?.shippingAddress?.zipCode || '',
  });

  const subtotal = getTotalPrice();
  const shippingCost = 7; // Frais de livraison fixes (ex: 7 TND)
  const total = subtotal + shippingCost;

  // Rediriger vers l'accueil si le panier est vide
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans text-center px-4 bg-zinc-950">
        <ShoppingBag size={64} className="text-zinc-600 mb-6" strokeWidth={1} />
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">Votre panier est vide</h1>
        <p className="text-zinc-400 mb-8">Vous n'avez pas encore d'articles dans votre panier pour passer commande.</p>
        <Link to="/textiles" className="bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          Retourner à la boutique
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Veuillez vous connecter pour valider votre commande.", {
        style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      navigate('/login');
      return;
    }

    if (!shippingInfo.address || !shippingInfo.phone) {
      toast.error("Veuillez remplir votre adresse de livraison et votre numéro de téléphone.", {
        style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      return;
    }

    setIsProcessing(true);

    const fullAddress = {
      address: shippingInfo.address,
      city: shippingInfo.city,
      zipCode: shippingInfo.zipCode,
      country: 'Tunisia'
    };

    const result = await checkoutCart(user._id, fullAddress);
    setIsProcessing(false);

    if (result.success) {
      clearCart();
      navigate('/order-success', { state: { orderId: result.orderId, total, shippingInfo } });
    } else {
      toast.error(`Erreur : ${result.message}`, {
        style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-20 font-sans relative overflow-hidden text-left">
      {/* Lueur de fond décorative */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* En-tête Checkout */}
        <div className="mb-8 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer">
            <ChevronLeft size={16} strokeWidth={2.5} />
            Retour
          </button>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Paiement Sécurisé</span>
          </div>
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-white">Validation de la Commande</h1>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Côté Gauche : Informations */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {!user && (
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex items-center justify-between shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                <div>
                  <h3 className="text-sm font-bold text-white">Vous avez déjà un compte ?</h3>
                  <p className="text-xs text-zinc-400 mt-1">Connectez-vous pour un passage en caisse plus rapide.</p>
                </div>
                <Link to="/login" className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-md hover:-translate-y-0.5">
                  Connexion
                </Link>
              </div>
            )}

            {/* Formulaire de livraison */}
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="bg-white text-black p-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  <Truck size={18} strokeWidth={2} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-tight text-white">Adresse de Livraison</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Prénom</label>
                  <input type="text" name="firstName" value={shippingInfo.firstName} onChange={handleInputChange} required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:bg-zinc-800 transition-all placeholder-zinc-600" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Nom</label>
                  <input type="text" name="lastName" value={shippingInfo.lastName} onChange={handleInputChange} required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:bg-zinc-800 transition-all placeholder-zinc-600" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Adresse complète</label>
                  <input type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} required placeholder="Ex: 12 Rue de la République..." className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:bg-zinc-800 transition-all placeholder-zinc-600" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Ville</label>
                  <select name="city" value={shippingInfo.city} onChange={handleInputChange} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:bg-zinc-800 transition-all appearance-none cursor-pointer">
                    <option value="Sfax">Sfax</option>
                    <option value="Tunis">Tunis</option>
                    <option value="Sousse">Sousse</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Code Postal</label>
                  <input type="text" name="zipCode" value={shippingInfo.zipCode} onChange={handleInputChange} placeholder="Ex: 3000" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:bg-zinc-800 transition-all placeholder-zinc-600" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Numéro de Téléphone</label>
                  <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleInputChange} required placeholder="Ex: +216 20 000 000" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:bg-zinc-800 transition-all placeholder-zinc-600" />
                </div>
              </div>
            </form>

            {/* Méthode de paiement */}
            <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="bg-white text-black p-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  <CreditCard size={18} strokeWidth={2} />
                </div>
                <h2 className="text-lg font-black uppercase tracking-tight text-white">Méthode de Paiement</h2>
              </div>
              
              <div className="border-2 border-white bg-white/5 backdrop-blur-md p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border-4 border-white bg-black flex items-center justify-center"></div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Paiement à la livraison</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Payez en espèces lorsque vous recevez votre commande.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Côté Droit : Récapitulatif (Sticky) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 sticky top-32 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <h2 className="text-lg font-black uppercase tracking-tight mb-6 text-white border-b border-white/10 pb-4">Résumé de la Commande</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-white/5 border border-white/10 rounded-xl overflow-hidden shrink-0 p-1 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold uppercase tracking-tight line-clamp-1 text-zinc-200">{item.name}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase mt-0.5 font-mono">Taille: {item.selectedSize} | Qté: {item.quantity}</p>
                      <p className="text-xs font-black mt-1 text-white">{item.price * item.quantity} TND</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-3 mb-6 text-zinc-300">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Sous-total</span>
                  <span className="font-bold text-white">{subtotal.toFixed(3)} TND</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Livraison (Standard)</span>
                  <span className="font-bold text-white">{shippingCost} TND</span>
                </div>
              </div>

              <div className="border-t border-white/20 pt-6 mb-8 flex justify-between items-end">
                <span className="text-sm font-black uppercase tracking-widest text-zinc-400">Total</span>
                <span className="text-2xl font-black text-white">{total.toFixed(3)} <span className="text-sm text-zinc-500">TND</span></span>
              </div>

              <button 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-400 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 cursor-pointer border-none"
              >
                {isProcessing ? "Traitement..." : "Confirmer ma commande"}
              </button>

              <p className="text-center text-[10px] text-zinc-500 mt-6 font-medium px-4">
                En passant votre commande, vous acceptez nos <span className="underline hover:text-white cursor-pointer transition-colors">Conditions Générales de Vente</span>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
