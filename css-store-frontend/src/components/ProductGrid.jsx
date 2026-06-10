import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, addToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // 🟢 CORRIGÉ : Syntaxe JavaScript nettoyée pour éviter le crash et supprimer via.placeholder
  const productImage = product.image || (product.images && product.images[0]) || '';

  return (
    <div className="bg-white border border-zinc-200 rounded-sm overflow-hidden flex flex-col justify-between h-full relative font-sans group hover:shadow-lg transition-all duration-300">
      
      {/* 🏷️ Badge "NOUVEAU" ou "BEST SELLER" selon la catégorie */}
      <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 z-10">
        {product.category === 'Accessoires' ? 'BEST SELLER' : 'NOUVEAU'}
      </span>

      {/* ❤️ Icône de Favoris (Bouton interactif) */}
      <button 
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-3 right-3 z-10 w-7 h-7 bg-white rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:scale-110 transition-all shadow-sm cursor-pointer"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>
      
      {/* 🖼️ Zone de l'image sur fond gris clair (Parfaitement centrée) */}
      <div className="h-64 w-full bg-[#F6F6F6] flex items-center justify-center p-6 relative overflow-hidden">
        {productImage ? (
          <img 
            src={productImage} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="text-zinc-300 font-black tracking-widest text-xs font-mono">CSS STORE</div>
        )}
      </div>
      
      {/* 📝 Contenu : Infos, Notation et Prix */}
      <div className="p-4 flex-grow flex flex-col justify-between bg-white text-left">
        <div>
          {/* Nom du produit */}
          <h3 className="font-medium text-xs md:text-sm text-zinc-700 tracking-tight line-clamp-1 group-hover:text-black transition-colors">
            {product.name}
          </h3>
          
          {/* Prix au format officiel DT */}
          <span className="block font-sans text-sm font-black text-black mt-1">
            {product.price ? Number(product.price).toFixed(3) : "0.000"} DT
          </span>
          
          {/* Étoiles de notation dynamiques */}
          <div className="flex items-center gap-0.5 mt-2 text-yellow-400 text-xs">
            ★★★★★ 
            <span className="text-zinc-400 font-mono text-[10px] ml-1.5">(42)</span>
          </div>
        </div>
        
        {/* 🛒 Bouton Ajouter au Panier Noir Massif */}
        <button 
          onClick={() => addToCart(product, 'M')}
          className="w-full mt-4 bg-black text-white hover:bg-zinc-800 font-bold py-3 text-[9px] tracking-widest transition-all duration-300 uppercase flex items-center justify-center gap-2 cursor-pointer rounded-none border-none"
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
      <div className="text-zinc-400 text-center py-16 font-mono text-xs tracking-widest uppercase animate-pulse">
        Chargement des produits populaires...
      </div>
    );
  }

  return (
    <div className="w-full">
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white border border-zinc-100 p-6">
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