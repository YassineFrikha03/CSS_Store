import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderData = location.state;

  useEffect(() => {
    // Si on accède à cette page sans données de commande, on redirige vers l'accueil
    if (!orderData) {
      navigate('/');
      return;
    }

    // Lancer des confettis majestueux
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#000000', '#ffffff', '#e5e5e5']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#000000', '#ffffff', '#e5e5e5']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [orderData, navigate]);

  if (!orderData) return null;

  return (
    <div className="min-h-[80vh] bg-white flex flex-col items-center justify-center font-sans px-4 py-20">
      <div className="max-w-2xl w-full text-center">
        
        {/* Icône de succès animée */}
        <div className="mb-8 relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <CheckCircle size={80} className="text-green-500 relative z-10" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-black">
          Commande Validée
        </h1>
        <p className="text-zinc-500 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed">
          Merci pour votre achat ! Votre commande a été reçue et est en cours de préparation. 
          Vous recevrez un appel de notre livreur très prochainement.
        </p>

        {/* Carte Récapitulative */}
        <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 mb-10 text-left max-w-md mx-auto relative overflow-hidden">
          {/* Design element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Numéro de Commande</p>
            <p className="text-lg font-mono font-black text-black mb-6">#{orderData.orderId.substring(0, 8).toUpperCase()}</p>

            <div className="flex items-start gap-4 mb-6">
              <Package size={20} className="text-zinc-400 mt-1 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Montant Total</p>
                <p className="text-base font-black text-black">{orderData.total} TND</p>
                <p className="text-[10px] text-zinc-500 mt-1">Payable à la livraison</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Truck size={20} className="text-zinc-400 mt-1 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Livraison prévue</p>
                <p className="text-sm font-bold text-black">{orderData.shippingInfo.address}, {orderData.shippingInfo.city}</p>
                <p className="text-[10px] text-zinc-500 mt-1">D'ici 2 à 4 jours ouvrés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/textiles" 
            className="w-full sm:w-auto bg-black text-white hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-0.5 px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
          >
            Continuer mes achats
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
          <Link 
            to="/profile" 
            className="w-full sm:w-auto bg-white text-black border border-zinc-200 hover:bg-zinc-50 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all text-center"
          >
            Mon Espace
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
