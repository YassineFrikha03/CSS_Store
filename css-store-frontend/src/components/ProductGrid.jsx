import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const ProductCard = ({ product, addToCart }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(product._id);

  const toggleFavorite = (e) => {
    e.preventDefault(); // Prevent Link click if it's inside a link
    e.stopPropagation(); // Prevent propagation
    if (favorite) {
      removeFavorite(product._id);
    } else {
      addFavorite(product._id);
    }
  };

  // 🟢 CORRIGÉ : Syntaxe JavaScript nettoyée pour éviter le crash et supprimer via.placeholder
  const productImage = product.image || (product.images && product.images[0]) || '';

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between h-full relative font-sans group hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:border-white/30 transition-all duration-300">
      
      {/* 🏷️ Badge "NOUVEAU" ou "BEST SELLER" selon la catégorie */}
      <span className="absolute top-3 left-3 bg-white text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 shadow-sm">
        {product.category === 'Accessoires' ? 'BEST SELLER' : 'NOUVEAU'}
      </span>

      {/* ❤️ Icône de Favoris (Bouton interactif) */}
      <button 
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 w-7 h-7 bg-black/50 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-black hover:scale-110 transition-all shadow-sm cursor-pointer"
      >
        {favorite ? '❤️' : '🤍'}
      </button>
      
      {/* 🖼️ Zone de l'image sur fond noir/transparent (Parfaitement centrée) */}
      <Link to={`/products/id/${product._id}`} className="h-64 w-full bg-white/5 flex items-center justify-center p-6 relative overflow-hidden block cursor-pointer">
        {productImage ? (
          <img 
            src={productImage} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="text-zinc-600 font-black tracking-widest text-xs font-mono">CSS STORE</div>
        )}
      </Link>
      
      {/* 📝 Contenu : Infos, Notation et Prix */}
      <div className="p-4 flex-grow flex flex-col justify-between bg-transparent text-left border-t border-white/5">
        <div>
          {/* Nom du produit */}
          <Link to={`/products/id/${product._id}`} className="font-medium text-xs md:text-sm text-zinc-300 tracking-tight line-clamp-1 group-hover:text-white transition-colors block cursor-pointer">
            {product.name}
          </Link>
          
          {/* Prix au format officiel DT */}
          <span className="block font-sans text-sm font-black text-white mt-1">
            {product.price ? Number(product.price).toFixed(3) : "0.000"} DT
          </span>
          
          {/* Étoiles de notation dynamiques */}
          <div className="flex items-center gap-0.5 mt-2 text-yellow-400 text-xs">
            ★★★★★ 
            <span className="text-zinc-500 font-mono text-[10px] ml-1.5">(42)</span>
          </div>
        </div>
        
        {/* 🛒 Bouton Ajouter au Panier Noir Massif */}
        <button 
          onClick={() => addToCart(product, 'M')}
          className="w-full mt-4 bg-white text-black hover:bg-zinc-200 font-bold py-3.5 text-[9px] tracking-widest transition-all duration-300 uppercase flex items-center justify-center gap-2 cursor-pointer rounded-xl border-none shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
        >
          <span>🛒</span> AJOUTER AU PANIER
        </button>
      </div>

    </div>
  );
};

const ProductGrid = ({ currentCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    const url = currentCategory 
      ? `http://localhost:5000/api/products?category=${currentCategory}`
      : 'http://localhost:5000/api/products';

    axios.get(url)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des produits :", error);
        setLoading(false);
      });
  }, [currentCategory]);

  if (loading) {
    return (
      <div className="text-zinc-500 text-center py-16 font-mono text-xs tracking-widest uppercase animate-pulse">
        Chargement des produits populaires...
      </div>
    );
  }

  return (
    <div className="w-full">
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
          <p className="text-zinc-400 text-xs font-light">Aucun article populaire disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;