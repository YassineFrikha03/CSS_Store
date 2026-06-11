import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Quote, Star } from 'lucide-react';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackReviews = [
    { user: { name: "Yassine K." }, rating: 5, comment: "Très bonne qualité du maillot et livraison rapide." },
    { user: { name: "Mohamed A." }, rating: 5, comment: "Produits officiels et service client au top !" },
    { user: { name: "Ahmed B." }, rating: 4, comment: "Fier de porter les couleurs de notre club 🖤🤍" }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reviews/all/approved');
        if (res.data && res.data.length > 0) {
          setReviews(res.data.slice(0, 3)); // Afficher 3 avis max sur la page d'accueil
        } else {
          setReviews(fallbackReviews);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des avis", err);
        setReviews(fallbackReviews);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-200 pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-black mb-2">Ils nous font confiance</h2>
          <p className="text-sm text-zinc-500 font-medium">Découvrez ce que nos supporters pensent de nos produits.</p>
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-black cursor-pointer transition-colors pb-1">Voir tous les avis &rarr;</span>
      </div>
      
      {loading ? (
        <div className="text-center py-12 text-sm text-zinc-400 font-mono">Chargement des avis...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <Quote size={32} className="text-zinc-200 mb-4 group-hover:text-black transition-colors duration-300" />
                <div className="flex items-center gap-1 mb-4 text-yellow-400">
                  {'★'.repeat(rev.rating || 5)}{'☆'.repeat(5 - (rev.rating || 5))}
                </div>
                <p className="text-sm text-zinc-700 font-medium leading-relaxed italic">"{rev.comment}"</p>
              </div>
              
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-zinc-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center font-black text-sm font-sans text-white shadow-md">
                    {rev.user?.name ? rev.user.name[0].toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-black">{rev.user?.name || "Anonyme"}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono uppercase mt-0.5">
                      {rev.product?.name ? "Achat vérifié" : "Supporter CSS"}
                    </p>
                  </div>
                </div>
                {rev.product?.imageUrl && (
                  <img src={rev.product.imageUrl} alt="Produit" className="w-10 h-10 object-contain mix-blend-darken opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;