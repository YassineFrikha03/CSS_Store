import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MaillotsPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // États locaux pour les filtres
  const [selectedSubCategory, setSelectedSubCategory] = useState('Tous');
  const [maxPrice, setMaxPrice] = useState(200);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/products?category=Matchwear')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des maillots:", error);
        setLoading(false);
      });
  }, []);

  // Logique de filtrage dynamique combiné (Sous-catégorie + Prix)
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

  const handleSizeChange = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  return (
    <div className="w-full bg-zinc-950 min-h-screen pt-24 pb-10 relative overflow-hidden font-sans text-left">
      {/* Lueur de fond décorative */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* EN-TÊTE DE PAGE & FIL D'ARIANE */}
        <div className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-2 text-left">
          Accueil &gt; <span className="text-white font-bold">Maillots</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-white/10 pb-4 mb-8 gap-4">
          <h1 className="text-3xl font-black uppercase tracking-wider text-white text-left">Nos Maillots</h1>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <span>Trier par :</span>
            <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white outline-none font-bold cursor-pointer appearance-none">
              <option className="bg-zinc-900 text-white">Meilleures ventes</option>
              <option className="bg-zinc-900 text-white">Prix : Croissant</option>
              <option className="bg-zinc-900 text-white">Prix : Décroissant</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* BARRE LATÉRALE DE FILTRES */}
          <aside className="w-full lg:w-64 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 select-none flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-white/10 pb-2 mb-3 text-left">
                Catégories
              </h3>
              <ul className="space-y-2 text-xs font-medium">
                {['Tous', 'Domicile', 'Extérieur', 'Third', 'Enfant', 'Gardien'].map((sub) => (
                  <li key={sub}>
                    <button 
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`w-full text-left py-1 transition-colors cursor-pointer ${
                        (sub === 'Tous' && selectedSubCategory === 'Tous') || selectedSubCategory === sub
                          ? 'text-white font-black pl-2 border-l-2 border-white' 
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {sub === 'Tous' ? 'Tous les maillots' : `Maillot ${sub}`}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-white/10 pb-2 mb-3 text-left">
                Filtres
              </h3>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wide mb-2 text-left">Prix</label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-white cursor-pointer bg-zinc-800" 
              />
              <div className="flex justify-between items-center text-[11px] font-mono font-bold text-white mt-2">
                <span>0 DT</span>
                <span className="bg-white/10 px-2 py-0.5 border border-white/10 rounded">{maxPrice} DT</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-white/10 pb-2 mb-3 text-left">
                Taille
              </h3>
              <div className="space-y-2.5">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <label key={size} className="flex items-center gap-3 text-xs font-medium text-zinc-400 cursor-pointer hover:text-white">
                    <input 
                      type="checkbox" 
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="w-4 h-4 accent-white cursor-pointer border-zinc-600 bg-zinc-800 rounded"
                    />
                    <span className={selectedSizes.includes(size) ? "font-black text-white" : ""}>{size}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* GRILLE DES MAILLOTS */}
          <div className="flex-grow w-full">
            {loading ? (
              <div className="text-zinc-500 text-center py-20 font-mono text-xs tracking-widest uppercase animate-pulse">
                Alignement de la collection Matchwear...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
                <p className="text-zinc-400 text-xs font-light">Aucun maillot ne correspond à vos critères de recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  // 🟢 CORRIGÉ : Supprimé via.placeholder fallback externe
                  const itemImg = product.imageUrl || product.image || (product.images && product.images[0]) || '';

                  return (
                    <div key={product._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between h-full relative group hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:border-white/30 transition-all duration-300">
                      
                      <span className="absolute top-3 left-3 bg-white text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 select-none shadow-sm">
                        NOUVEAU
                      </span>

                      <button 
                        onClick={() => toggleFavorite(product._id)}
                        className="absolute top-3 right-3 z-10 w-7 h-7 bg-black/50 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-black hover:scale-110 transition-all shadow-sm cursor-pointer"
                      >
                        {favorites[product._id] ? '❤️' : '🤍'}
                      </button>
                      
                      <Link to={`/products/id/${product._id}`} className="h-64 w-full bg-white/5 flex items-center justify-center p-6 relative overflow-hidden block cursor-pointer">
                        {itemImg ? (
                          <img 
                            src={itemImg} 
                            alt={product.name} 
                            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-zinc-600 font-black tracking-widest text-xs font-mono">CSS STORE</div>
                        )}
                      </Link>
                      
                      <div className="p-4 flex-grow flex flex-col justify-between bg-transparent text-left border-t border-white/5">
                        <div>
                          <Link to={`/products/id/${product._id}`} className="cursor-pointer block hover:text-white transition-colors">
                            <h3 className="font-bold text-xs text-zinc-300 tracking-tight line-clamp-2 uppercase">
                              {product.name}
                            </h3>
                          </Link>
                          <span className="block font-sans text-sm font-black text-white mt-2">
                            {Number(product.price).toFixed(3)} TND
                          </span>
                          <div className="flex items-center gap-0.5 mt-2 text-yellow-400 text-[10px]">
                            ★★★★★ <span className="text-zinc-500 font-mono text-[9px] ml-1">(31)</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => addToCart(product, 'M')}
                          className="w-full mt-4 bg-white text-black hover:bg-zinc-200 font-bold py-3.5 text-[9px] tracking-widest transition-all duration-300 uppercase flex items-center justify-center gap-2 cursor-pointer border-none rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
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

export default MaillotsPage;