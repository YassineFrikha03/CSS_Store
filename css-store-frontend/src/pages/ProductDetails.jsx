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

  if (loading) return (
    <div className="w-full bg-zinc-950 min-h-screen pt-24 pb-10 flex items-center justify-center">
      <p className="text-xs font-mono text-zinc-400 p-12 text-center animate-pulse">Chargement des détails du produit...</p>
    </div>
  );
  if (!product) return (
    <div className="w-full bg-zinc-950 min-h-screen pt-24 pb-10 flex items-center justify-center">
      <p className="text-xs font-mono text-red-500 p-12 text-center">Produit introuvable.</p>
    </div>
  );

  // Simulation d'un prix de base barré (marge promotionnelle de 20% conforme à la charte)
  const originalPrice = (product.price / 0.8).toFixed(3);

  const handleAddToCart = () => {
    if (product) {
      const size = product.category?.toLowerCase().includes('accessoire') ? 'Unique' : selectedSize;
      addToCart(product, size, quantity);
      toast.success("Produit ajouté au panier ! 🖤🤍", {
        style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Veuillez vous connecter pour laisser un avis.", {
        style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Veuillez écrire un commentaire.", {
        style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      return;
    }
    try {
      const t = sessionStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/reviews/${id}`, newReview, {
        headers: { Authorization: `Bearer ${t}` }
      });
      toast.success("Avis soumis avec succès ! En attente de validation.", {
        style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error("Erreur lors de l'envoi de l'avis.", {
        style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    }
  };

  return (
    <div className="w-full bg-zinc-950 min-h-screen pt-24 pb-10 relative overflow-hidden font-sans text-left">
      {/* Lueur de fond décorative */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* FIL D'ARIANE */}
        <div className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest mb-6">
          Accueil &gt; <span className="text-white font-bold">{product.name}</span>
        </div>

        {/* ZONE SUPÉRIEURE : MÉDIAS ET CONFIGURATION ACHAT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          
          {/* MINIATURES ET VISUEL CENTRAL */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
              {[product.imageUrl, product.imageUrl, product.imageUrl].map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImg(img || '')}
                  className={`flex-shrink-0 w-16 h-16 border-2 p-1.5 bg-white/5 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer transition-all ${
                    activeImg === img ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-white/10 hover:border-white/30'
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
            
            <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex items-center justify-center min-h-[450px] relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {activeImg ? (
                <img src={activeImg} alt={product.name} className="max-h-[400px] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="text-zinc-600 font-black text-3xl font-mono tracking-widest">CSS STORE</div>
              )}
            </div>
          </div>

          {/* DETAILS ET CONFIGURATION PRODUIT */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-block bg-white text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                -20% PROMO
              </div>
              <button 
                onClick={toggleFavorite}
                className={`p-2.5 rounded-full border border-white/10 backdrop-blur-md transition-all hover:scale-105 cursor-pointer ${
                  favorite ? 'bg-zinc-900 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-white/5 hover:bg-white/10 shadow-sm'
                }`}
                aria-label="Ajouter aux favoris"
              >
                <Heart size={20} fill={favorite ? "#dc2626" : "none"} color={favorite ? "#dc2626" : "white"} strokeWidth={2} />
              </button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-1 text-yellow-400 text-sm mt-2 drop-shadow-sm">
              {'★'.repeat(5)} <span className="text-zinc-400 font-mono text-[11px] ml-1.5">({reviews.length} Avis vérifiés)</span>
            </div>

            <div className="flex items-baseline gap-3 mt-4 bg-white/5 backdrop-blur-md border border-white/10 w-fit px-6 py-4 rounded-2xl">
              <span className="text-zinc-500 line-through font-mono text-lg">{originalPrice} TND</span>
              <span className="text-white font-black text-3xl font-mono">{Number(product.price).toFixed(3)} TND</span>
            </div>

            <div className="text-xs space-y-1 font-medium text-zinc-300 font-mono">
              <p><span className="text-zinc-500">Code produit:</span> {product._id.slice(-8).toUpperCase()}</p>
              <p><span className="text-zinc-500">Marque:</span> Hummel</p>
              <p><span className="text-zinc-500">Catégorie:</span> {product.category}-css-Tunisie</p>
            </div>

            <hr className="border-white/10 my-6" />

            {/* SÉLECTEUR DE TAILLE (Affiché uniquement pour les vêtements/maillots) */}
            {!product.category?.toLowerCase().includes('accessoire') && (
              <div>
                <label className="block text-[11px] font-black uppercase text-zinc-400 mb-3 flex justify-between items-end">
                  <span>Taille: <span className="text-white ml-1">{selectedSize}</span></span>
                  <span className="text-zinc-500 font-mono underline cursor-pointer hover:text-white transition-colors">Guide des tailles</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 text-[11px] font-bold border rounded-xl transition-all cursor-pointer ${
                        selectedSize === size 
                          ? 'bg-white border-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105' 
                          : 'bg-white/5 border-white/10 text-white hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AJOUT AU PANIER ET QUANTITÉS */}
            <div className="space-y-4 pt-6">
              <div className="flex gap-4">
                <div className="flex items-center border border-white/10 bg-white/5 backdrop-blur-md rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-4 text-zinc-400 hover:text-white hover:bg-white/10 font-bold cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="px-2 font-mono font-bold text-base w-10 text-center text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-4 text-zinc-400 hover:text-white hover:bg-white/10 font-bold cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-white text-black py-4 px-6 text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <span>🛒</span> Ajouter au panier
                </button>
              </div>

              <button 
                onClick={() => { handleAddToCart(); }}
                className="w-full bg-zinc-900 border border-white/10 text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 rounded-xl cursor-pointer"
              >
                Achat Rapide
              </button>
            </div>
            
            {/* RÉASSURANCES */}
            <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-white/10">
              <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-medium uppercase tracking-wider">
                <span className="text-lg">🚚</span> Livraison 24-48h
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-medium uppercase tracking-wider">
                <span className="text-lg">🛡️</span> Paiement Sécurisé
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-medium uppercase tracking-wider">
                <span className="text-lg">🔁</span> Retours Gratuits
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-medium uppercase tracking-wider">
                <span className="text-lg">⭐</span> 100% Officiel
              </div>
            </div>
          </div>
        </div>

        {/* ZONE INFÉRIEURE : DESCRIPTIONS COMPLÉMENTAIRES TEXTILES */}
        <div className="border-t border-white/10 pt-16 pb-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider mb-6 text-white flex items-center gap-3">
                <span className="w-8 h-[2px] bg-white inline-block"></span>
                Description du produit
              </h3>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-6 bg-white/5 border border-white/10 p-6 rounded-2xl">{product.description}</p>
              <ul className="text-sm text-zinc-300 font-medium space-y-3 list-none bg-white/5 border border-white/10 p-6 rounded-2xl">
                <li className="flex items-start gap-3"><span className="text-white mt-0.5">▪</span> Marque : Hummel</li>
                <li className="flex items-start gap-3"><span className="text-white mt-0.5">▪</span> Designed au Danemark</li>
                <li className="flex items-start gap-3"><span className="text-white mt-0.5">▪</span> Coupe officielle ajustée pour les supporters du Club Sportif Sfaxien</li>
                <li className="flex items-start gap-3"><span className="text-white mt-0.5">▪</span> Technologie Hummel Bee Cool pour une évacuation optimale de la chaleur</li>
                <li className="flex items-start gap-3"><span className="text-white mt-0.5">▪</span> Entretien : Lavage en machine conforme aux indications de l'étiquette</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-black uppercase tracking-wider mb-6 text-white flex items-center gap-3">
                <span className="w-8 h-[2px] bg-white inline-block"></span>
                Informations Complémentaires
              </h3>
              <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center h-[calc(100%-3rem)] gap-6">
                <div className="border border-white/20 p-4 px-8 inline-block bg-black rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.05)] font-mono font-black tracking-widest text-2xl text-white">
                  hummel
                </div>
                <div className="font-mono text-xs text-zinc-500 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <span className="font-bold text-white mr-2">EAN-13:</span> 4000000{product._id.slice(-5)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ZONE DES AVIS (REVIEWS) */}
        <div className="pt-16 border-t border-white/10">
          <h2 className="text-2xl font-black uppercase tracking-wider mb-10 text-white flex items-center gap-4 justify-center md:justify-start">
            Avis Clients
            <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full border border-white/10">{reviews.length}</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Formulaire pour ajouter un avis */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl h-fit backdrop-blur-md sticky top-24">
                <h3 className="text-sm font-black uppercase tracking-wider mb-6 text-white">Laisser un avis</h3>
                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-zinc-400 mb-2">Note (sur 5)</label>
                      <select 
                        value={newReview.rating} 
                        onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                        className="w-full bg-zinc-900 border border-white/10 text-white rounded-xl p-3.5 text-sm font-medium outline-none focus:border-white focus:bg-zinc-800 transition-colors cursor-pointer appearance-none"
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
                        className="w-full bg-zinc-900 border border-white/10 text-white rounded-xl p-4 text-sm outline-none focus:border-white focus:bg-zinc-800 transition-colors h-32 resize-none placeholder-zinc-600"
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="w-full bg-white text-black py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 border-none mt-2">
                      Envoyer l'avis
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-10 bg-zinc-900/50 rounded-2xl border border-white/5">
                    <p className="text-sm text-zinc-400 mb-6 px-4">Vous devez être connecté pour partager votre expérience.</p>
                    <button onClick={() => navigate('/login')} className="bg-white text-black px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-zinc-200 transition-colors border-none cursor-pointer">
                      Se Connecter
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Liste des avis existants */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              {reviews.length === 0 ? (
                <div className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center backdrop-blur-md">
                  <p className="text-zinc-400 text-sm italic font-medium">Aucun avis publié pour ce produit pour le moment.</p>
                  <p className="text-white font-black mt-2">Soyez le premier à partager votre avis !</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-md hover:border-white/20 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-black text-sm border border-white/10 group-hover:border-white/30 transition-colors">
                          {(review.user?.name || "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block">{review.user?.name || "Anonyme"}</span>
                          <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-yellow-400 text-sm bg-black/30 px-3 py-1.5 rounded-full border border-white/5">
                        {'★'.repeat(review.rating)}<span className="text-zinc-700">{'★'.repeat(5 - review.rating)}</span>
                      </div>
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed mt-4 pl-13">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;