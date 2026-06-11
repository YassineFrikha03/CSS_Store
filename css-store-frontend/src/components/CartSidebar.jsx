import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none font-sans">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-zinc-100 text-black flex flex-col shadow-2xl">
          
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-white">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <ShoppingBag size={18} strokeWidth={2} />
              Mon Panier
            </h2>
            <button 
              onClick={() => setIsCartOpen(false)} 
              className="p-2 -mr-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition-all cursor-pointer"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <ShoppingBag size={48} strokeWidth={1} className="mb-4 text-zinc-200" />
                <span className="text-xs font-bold tracking-widest uppercase">Votre panier est vide</span>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="flex gap-4 bg-white p-3 rounded-2xl border border-zinc-100 shadow-sm relative group">
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-[13px] font-black uppercase tracking-tight text-black leading-tight pr-4">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500 mt-1 uppercase font-semibold">Taille: {item.selectedSize}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-zinc-100 rounded-full border border-zinc-200 overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item._id, item.selectedSize, -1)} 
                          className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-white hover:text-black transition-colors cursor-pointer"
                        >
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.selectedSize, 1)} 
                          className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-white hover:text-black transition-colors cursor-pointer"
                        >
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>
                      <span className="font-black text-sm">{(item.price * item.quantity).toFixed(3)} TND</span>
                    </div>
                  </div>
                  
                  {/* Bouton de suppression rapide */}
                  <button 
                    onClick={() => updateQuantity(item._id, item.selectedSize, -item.quantity)}
                    className="absolute top-2 right-2 p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t border-zinc-100 bg-white">
              <div className="flex justify-between items-end mb-4">
                <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Total</span>
                <span className="text-2xl font-black text-black">{getTotalPrice().toFixed(3)} TND</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-medium mb-5 text-center px-4">
                Taxes incluses. Les frais de livraison sont calculés à la prochaine étape.
              </p>
              
              <button 
                onClick={handleGoToCheckout}
                className="w-full bg-black text-white hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-0.5 rounded-full font-black py-4 text-xs tracking-[0.2em] transition-all duration-300 uppercase cursor-pointer flex items-center justify-center gap-2"
              >
                Passer à la caisse
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartSidebar;