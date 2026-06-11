import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState('');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  const { user } = useUser();
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = product ? isFavorite(product._id) : false;

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(product._id);
    } else {
      addFavorite(product._id);
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/id/${id}`);
        setProduct(res.data);
        setActiveImg(res.data.imageUrl || '');
      } catch (err) {
        console.error("Erreur lors du chargement du produit", err);
      }
      try {
        const revRes = await axios.get(`http://localhost:5000/api/reviews/product/${id}`);
        setReviews(revRes.data);
      } catch (err) {
        console.error("Erreur chargement avis", err);
      }
      setLoading(false);
    };
    fetchProductDetails();
  }, [id]);

  if (loading) return <p className="text-xs font-mono text-zinc-400 p-12 text-center">Chargement des détails du produit...</p>;
  if (!product) return <p className="text-xs font-mono text-red-500 p-12 text-center">Produit introuvable.</p>;

  // Simulation d'un prix de base barré (marge promotionnelle de 20% conforme à la charte)
  const originalPrice = (product.price / 0.8).toFixed(3);

  const handleAddToCart = () => {
    if (product) {
      const size = product.category?.toLowerCase().includes('accessoire') ? 'Unique' : selectedSize;
      addToCart(product, size, quantity);
      toast.success("Produit ajouté au panier ! 🖤🤍");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Veuillez vous connecter pour laisser un avis.");
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Veuillez écrire un commentaire.");
      return;
    }
    try {
      const t = sessionStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/reviews/${id}`, newReview, {
        headers: { Authorization: `Bearer ${t}` }
      });
      toast.success("Avis soumis avec succès ! En attente de validation.");
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error("Erreur lors de l'envoi de l'avis.");
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
                className={`w-16 h-16 border-2 p-1.5 bg-zinc-50/50 rounded-xl overflow-hidden cursor-pointer transition-all ${
                  activeImg === img ? 'border-black shadow-md' : 'border-transparent hover:border-zinc-300'
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
          
          <div className="flex-1 bg-zinc-50/50 border border-zinc-100 rounded-3xl p-8 flex items-center justify-center min-h-[450px]">
            {activeImg ? (
              <img src={activeImg} alt={product.name} className="max-h-[400px] object-contain mix-blend-darken" />
            ) : (
              <div className="text-zinc-300 font-black text-3xl font-mono tracking-widest">CSS STORE</div>
            )}
          </div>
        </div>

        {/* DETAILS ET CONFIGURATION PRODUIT */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="inline-block bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              -20% PROMO
            </div>
            <button 
              onClick={toggleFavorite}
              className="p-2.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm transition-transform hover:scale-105 cursor-pointer"
              aria-label="Ajouter aux favoris"
            >
              <Heart size={20} fill={favorite ? "#dc2626" : "none"} color={favorite ? "#dc2626" : "black"} strokeWidth={2} />
            </button>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black uppercase text-zinc-900 tracking-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-1 text-yellow-400 text-sm mt-2">
            {'★'.repeat(5)} <span className="text-zinc-400 font-mono text-[11px] ml-1.5">({reviews.length} Avis vérifiés)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
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
                    className={`w-10 h-10 text-[11px] font-bold border rounded-xl transition-all cursor-pointer ${
                      selectedSize === size 
                        ? 'bg-black border-black text-white shadow-md' 
                        : 'border-zinc-200 text-zinc-800 hover:border-black hover:bg-zinc-50'
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
              <div className="flex items-center border border-zinc-200 bg-zinc-50/50 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3.5 text-zinc-500 hover:text-black hover:bg-zinc-100 font-bold cursor-pointer transition-colors"
                >
                  -
                </button>
                <span className="px-4 font-mono font-bold text-sm w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-3.5 text-zinc-500 hover:text-black hover:bg-zinc-100 font-bold cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-3.5 px-6 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <span>🛒</span> Ajouter au panier
              </button>
            </div>

            <button 
              onClick={() => { handleAddToCart(); }}
              className="w-full bg-red-600 text-white py-3.5 text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-xl cursor-pointer border-none"
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
          <div className="border border-zinc-200 p-6 inline-block bg-white rounded-2xl shadow-sm font-mono font-black tracking-widest text-lg text-zinc-800">
            hummel
          </div>
          <div className="mt-4 font-mono text-[11px] text-zinc-500">
            <span className="font-bold text-zinc-800">EAN-13:</span> 4000000{product._id.slice(-5)}
          </div>
        </div>
      </div>

      {/* ZONE DES AVIS (REVIEWS) */}
      <div className="mt-16 pt-12 border-t border-zinc-200">
        <h2 className="text-xl font-black uppercase tracking-wider mb-8 text-black">Avis Clients</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Liste des avis existants */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-zinc-500 text-sm italic">Aucun avis publié pour ce produit pour le moment. Soyez le premier !</p>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="bg-white border border-zinc-100 p-6 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-zinc-800 text-sm">{review.user?.name || "Anonyme"}</span>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  <p className="text-zinc-600 text-sm leading-relaxed">{review.comment}</p>
                  <p className="text-[10px] font-mono text-zinc-400 mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>

          {/* Formulaire pour ajouter un avis */}
          <div className="bg-[#FAFAFA] border border-zinc-100 p-8 rounded-3xl h-fit">
            <h3 className="text-sm font-black uppercase tracking-wider mb-6">Laisser un avis</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-black uppercase text-zinc-400 mb-2">Note (sur 5)</label>
                  <select 
                    value={newReview.rating} 
                    onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                    className="w-full border-zinc-200 bg-white border rounded-xl p-3 text-sm font-medium outline-none focus:border-black"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5) Excellent</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5) Très Bien</option>
                    <option value={3}>⭐⭐⭐ (3/5) Bien</option>
                    <option value={2}>⭐⭐ (2/5) Moyen</option>
                    <option value={1}>⭐ (1/5) Décevant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-zinc-400 mb-2">Votre message</label>
                  <textarea 
                    value={newReview.comment}
                    onChange={e => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Partagez votre expérience avec ce produit..."
                    className="w-full border-zinc-200 bg-white border rounded-xl p-4 text-sm outline-none focus:border-black h-32 resize-none"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-black text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors cursor-pointer">
                  Envoyer l'avis
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-zinc-500 mb-4">Vous devez être connecté pour laisser un avis.</p>
                <button onClick={() => navigate('/login')} className="bg-black text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider">
                  Se Connecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;