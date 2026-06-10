import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext'; // Importation pour vérifier la connexion

const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, getTotalPrice, checkoutCart } = useCart();
  const { user } = useUser(); // Récupération du supporter actif
  const [isOrdering, setIsOrdering] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!user) {
      alert("Veuillez vous connecter à votre Espace Supporter pour passer la commande 🖤🤍");
      return;
    }

    setIsOrdering(true);
    // On lance le checkout avec l'ID du supporter et son adresse stockée
    const result = await checkoutCart(user._id, user.shippingAddress);
    setIsOrdering(false);

    if (result.success) {
      alert(`Commande validée avec succès ! ID de votre reçu : ${result.orderId}\nVotre colis est en préparation pour livraison.`);
    } else {
      alert(`Erreur : ${result.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F0F0F] border-l border-zinc-900 text-white flex flex-col shadow-2xl">
          
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <h2 className="text-lg font-black uppercase tracking-widest">Votre Armure</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-zinc-500 hover:text-white transition-colors text-xs uppercase tracking-wider cursor-pointer">
              Fermer [X]
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 text-zinc-600 text-xs font-mono tracking-wider">
                VOTRE PANIER EST VIDE.
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-zinc-950/50 p-4 border border-zinc-900">
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover filter grayscale contrast-115" />
                  <div className="flex-grow">
                    <h3 className="text-xs font-bold uppercase tracking-tight text-white">{item.name}</h3>
                    <p className="text-[10px] text-zinc-500 mt-1 uppercase font-mono">Taille : {item.selectedSize}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => updateQuantity(item._id, item.selectedSize, -1)} className="w-6 h-6 bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center text-xs cursor-pointer">-</button>
                      <span className="text-xs font-mono">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.selectedSize, 1)} className="w-6 h-6 bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center text-xs cursor-pointer">+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold">{item.price * item.quantity} TND</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t border-zinc-900 bg-zinc-950/80 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-zinc-400 text-xs uppercase tracking-widest font-mono">Sous-total :</span>
                <span className="text-2xl font-black font-mono text-white">{getTotalPrice()} TND</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-light">Livraison calculée lors du passage en caisse. Retrait gratuit possible au Store du Stade Taïeb Mhiri.</p>
              
              <button 
                onClick={handleCheckout}
                disabled={isOrdering}
                className="w-full bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-700 font-bold py-4 text-xs tracking-widest transition-all duration-300 uppercase mt-2 cursor-pointer"
              >
                {isOrdering ? "Traitement..." : user ? "Confirmer et Commander" : "Se connecter pour commander"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartSidebar;