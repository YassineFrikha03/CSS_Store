import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const AccessoiresPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSubCategory, setSelectedSubCategory] = useState('Tous');
  const [maxPrice, setMaxPrice] = useState(150);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/products?category=Accessoires')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des accessoires:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = products;

    if (selectedSubCategory !== 'Tous') {
      result = result.filter(p => p.name.toLowerCase().includes(selectedSubCategory.toLowerCase()));
    }

    result = result.filter(p => (p.price || p.total) <= maxPrice);
    setFilteredProducts(result);
  }, [selectedSubCategory, maxPrice, products]);

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full bg-[#F9F9F9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* EN-TÊTE DE PAGE & FIL D'ARIANE */}
        <div className="text-zinc-400 text-[10px] uppercase font-mono tracking-widest mb-2 text-left">
          Accueil &gt; <span className="text-black font-bold">Accessoires</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-zinc-200 pb-4 mb-8 gap-4">
          <h1 className="text-3xl font-black uppercase tracking-wider text-black text-left">Accessoires</h1>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <span>Trier par :</span>
            <select className="bg-white border border-zinc-300 rounded-none px-3 py-1.5 text-black outline-none font-bold cursor-pointer">
              <option>Meilleures ventes</option>
              <option>Prix : Croissant</option>
              <option>Prix : Décroissant</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* BARRE LATÉRALE DE FILTRES */}
          <aside className="w-full lg:w-64 bg-white border border-zinc-200 p-6 select-none flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-100 pb-2 mb-3 text-left">
                Types d'accessoires
              </h3>
              <ul className="space-y-2 text-xs font-medium">
                {['Tous', 'Casquette', 'Écharpe', 'Sac', 'Ballon'].map((sub) => (
                  <li key={sub}>
                    <button 
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`w-full text-left py-1 transition-colors cursor-pointer ${
                        (sub === 'Tous' && selectedSubCategory === 'Tous') || selectedSubCategory === sub
                          ? 'text-black font-black pl-2 border-l-2 border-black' 
                          : 'text-zinc-500 hover:text-black'
                      }`}
                    >
                      {sub === 'Tous' ? 'Tous les accessoires' : sub + 's'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-black border-b border-zinc-100 pb-2 mb-3 text-left">
                Filtres
              </h3>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wide mb-2 text-left">Prix maximum</label>
              <input 
                type="range" 
                min="0" 
                max="150" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-black cursor-pointer" 
              />
              <div className="flex justify-between items-center text-[11px] font-mono font-bold text-black mt-2">
                <span>0 DT</span>
                <span className="bg-zinc-100 px-2 py-0.5 border border-zinc-200">{maxPrice} DT</span>
              </div>
            </div>
          </aside>

          {/* GRILLE DES ACCESSOIRES */}
          <div className="flex-grow w-full">
            {loading ? (
              <div className="text-zinc-400 text-center py-20 font-mono text-xs tracking-widest uppercase animate-pulse">
                Chargement des accessoires officiels...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white border border-zinc-200 p-8">
                <p className="text-zinc-400 text-xs font-light">Aucun accessoire ne correspond à vos critères.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  // 🟢 CORRIGÉ : Nettoyé l'URL via.placeholder externe
                  const itemImg = product.imageUrl || product.image || (product.images && product.images[0]) || '';

                  return (
                    <div key={product._id} className="bg-white border border-zinc-100 rounded-2xl overflow-hidden flex flex-col justify-between h-full relative group hover:shadow-xl hover:-translate-y-1 hover:border-zinc-200 transition-all duration-300">
                      
                      <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 select-none shadow-sm">
                        PROMO
                      </span>

                      <button 
                        onClick={() => toggleFavorite(product._id)}
                        className="absolute top-3 right-3 z-10 w-7 h-7 bg-white rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:scale-110 transition-all shadow-sm cursor-pointer"
                      >
                        {favorites[product._id] ? '❤️' : '🤍'}
                      </button>
                      
                      <Link to={`/products/id/${product._id}`} className="h-64 w-full bg-[#F6F6F6] flex items-center justify-center p-6 relative overflow-hidden block cursor-pointer">
                        {itemImg ? (
                          <img 
                            src={itemImg} 
                            alt={product.name} 
                            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-darken"
                          />
                        ) : (
                          <div className="text-zinc-300 font-black tracking-widest text-xs font-mono">CSS STORE</div>
                        )}
                      </Link>
                      
                      <div className="p-4 flex-grow flex flex-col justify-between bg-white text-left">
                        <div>
                          <Link to={`/products/id/${product._id}`} className="cursor-pointer block hover:text-zinc-600 transition-colors">
                            <h3 className="font-bold text-xs text-zinc-900 tracking-tight line-clamp-2 uppercase">
                              {product.name}
                            </h3>
                          </Link>
                          <span className="block font-sans text-sm font-black text-black mt-2">
                            {Number(product.price).toFixed(3)} TND
                          </span>
                          <div className="flex items-center gap-0.5 mt-2 text-yellow-400 text-[10px]">
                            ★★★★★ <span className="text-zinc-400 font-mono text-[9px] ml-1">(12)</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => addToCart(product, 'Unique')}
                          className="w-full mt-4 bg-black text-white hover:bg-zinc-800 font-bold py-3.5 text-[9px] tracking-widest transition-all duration-300 uppercase flex items-center justify-center gap-2 cursor-pointer border-none rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                          🛒 AJOUTER AU PANIER
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccessoiresPage;