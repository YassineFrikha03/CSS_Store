import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState('');

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/id/${id}`);
        setProduct(res.data);
        setActiveImg(res.data.imageUrl || '');
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du produit", err);
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) return <p className="text-xs font-mono text-zinc-400 p-12 text-center">Chargement des détails du produit...</p>;
  if (!product) return <p className="text-xs font-mono text-red-500 p-12 text-center">Produit introuvable.</p>;

  // Simulation d'un prix de base barré (marge promotionnelle de 20% conforme à la charte)
  const originalPrice = (product.price / 0.8).toFixed(3);

  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:5000/api/carts/add', {
        productId: product._id,
        quantity,
        size: product.category?.toLowerCase().includes('accessoire') ? 'Unique' : selectedSize
      });
      alert("Produit ajouté au panier ! 🖤🤍");
    } catch (err) {
      alert("Veuillez vous connecter pour gérer votre panier.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-sans text-left">
      
      {/* ZONE SUPÉRIEURE : MÉDIAS ET CONFIGURATION ACHAT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
        
        {/* MINIATURES ET VISUEL CENTRAL */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {[product.imageUrl, product.imageUrl, product.imageUrl].map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImg(img || '')}
                className={`w-14 h-14 border p-1 bg-zinc-50 overflow-hidden cursor-pointer transition-all ${
                  activeImg === img ? 'border-black' : 'border-zinc-200'
                }`}
              >
                {img ? (
                  <img src={img} alt="" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-zinc-900 text-white text-[8px] flex items-center justify-center font-bold">CSS</div>
                )}
              </button>
            ))}
          </div>
          
          <div className="flex-1 bg-zinc-50 border border-zinc-100 p-8 flex items-center justify-center min-h-[450px]">
            {activeImg ? (
              <img src={activeImg} alt={product.name} className="max-h-[400px] object-contain mix-blend-darken" />
            ) : (
              <div className="text-zinc-300 font-black text-3xl font-mono tracking-widest">CSS STORE</div>
            )}
          </div>
        </div>

        {/* DETAILS ET CONFIGURATION PRODUIT */}
        <div className="space-y-6">
          <div className="inline-block bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
            -20%
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black uppercase text-zinc-900 tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3">
            <span className="text-zinc-400 line-through font-mono text-sm">{originalPrice} TND</span>
            <span className="text-red-600 font-black text-2xl font-mono">{Number(product.price).toFixed(3)} TND</span>
          </div>

          <div className="text-xs space-y-1 font-medium text-zinc-600 font-mono">
            <p><span className="text-zinc-400">Code produit:</span> {product._id.slice(-8).toUpperCase()}</p>
            <p><span className="text-zinc-400">Marque:</span> Hummel</p>
            <p><span className="text-zinc-400">Catégorie:</span> {product.category}-css-Tunisie</p>
          </div>

          <hr className="border-zinc-200" />

          {/* SÉLECTEUR DE TAILLE (Affiché uniquement pour les vêtements/maillots) */}
          {!product.category?.toLowerCase().includes('accessoire') && (
            <div>
              <label className="block text-[11px] font-black uppercase text-zinc-400 mb-2">Taille: {selectedSize}</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-8 text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedSize === size 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-zinc-200 text-zinc-800 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AJOUT AU PANIER ET QUANTITÉS */}
          <div className="space-y-3 pt-4">
            <div className="flex gap-4">
              <div className="flex items-center border border-zinc-200 bg-white">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-zinc-500 hover:text-black font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 font-mono font-bold text-xs">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-2 text-zinc-500 hover:text-black font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-zinc-900 text-white py-3 px-6 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                🛒 Ajouter au panier
              </button>
            </div>

            <button 
              onClick={() => { handleAddToCart(); navigate('/cart'); }}
              className="w-full bg-red-600 text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors cursor-pointer"
            >
              Achat Rapide
            </button>
          </div>
        </div>
      </div>

      {/* ZONE INFÉRIEURE : DESCRIPTIONS COMPLÉMENTAIRES TEXTILES */}
      <div className="border-t border-zinc-200 pt-12 space-y-8">
        <div>
          <h3 className="text-lg font-black uppercase tracking-wider mb-4">Description</h3>
          <p className="text-xs text-zinc-600 font-medium leading-relaxed mb-4">{product.description}</p>
          <ul className="text-xs text-zinc-700 font-medium space-y-2 list-disc list-inside">
            <li>Marque : Hummel</li>
            <li>Designed au Danemark</li>
            <li>Coupe officielle ajustée pour les supporters du Club Sportif Sfaxien</li>
            <li>Technologie Hummel Bee Cool pour une évacuation optimale de la chaleur</li>
            <li>Entretien : Lavage en machine conforme aux indications de l'étiquette</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-black uppercase tracking-wider mb-4">Informations Complémentaires</h3>
          <div className="border border-zinc-200 p-6 inline-block bg-zinc-50 font-mono font-black tracking-widest text-lg text-zinc-800">
            hummel
          </div>
          <div className="mt-4 font-mono text-[11px] text-zinc-500">
            <span className="font-bold text-zinc-800">EAN-13:</span> 4000000{product._id.slice(-5)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;