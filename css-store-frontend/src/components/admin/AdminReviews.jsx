import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingReviews = async () => {
    try {
      const t = sessionStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/reviews/admin/pending', {
        headers: { Authorization: `Bearer ${t}` }
      });
      setReviews(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des avis en attente", err);
      toast.error("Erreur lors du chargement des avis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const handleReviewStatus = async (reviewId, status) => {
    try {
      const t = sessionStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/reviews/admin/${reviewId}`, { status }, {
        headers: { Authorization: `Bearer ${t}` }
      });
      toast.success(`Avis ${status === 'approved' ? 'approuvé' : 'rejeté'} avec succès.`);
      fetchPendingReviews(); // Recharger la liste
    } catch (err) {
      console.error("Erreur modération avis", err);
      toast.error("Erreur lors de la modération de l'avis.");
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-zinc-500">Chargement des avis en attente...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
      <h2 className="text-xl font-black mb-6 uppercase tracking-wider text-black">Avis en attente ({reviews.length})</h2>
      
      {reviews.length === 0 ? (
        <p className="text-zinc-500 text-sm">Aucun avis en attente de modération pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="border border-zinc-200 p-4 rounded-xl flex items-start gap-4 hover:bg-zinc-50 transition-colors">
              <div className="w-16 h-16 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                {review.product?.imageUrl ? (
                  <img src={review.product.imageUrl} alt={review.product?.name} className="w-full h-full object-contain mix-blend-darken" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-400">CSS</div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-zinc-800 text-sm">{review.product?.name || "Produit Inconnu"}</h3>
                    <p className="text-xs text-zinc-500 font-mono mt-1">Par {review.user?.name} ({review.user?.email})</p>
                  </div>
                  <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p className="text-zinc-600 text-sm mt-3 bg-white border border-zinc-100 p-3 rounded-lg italic">
                  "{review.comment}"
                </p>
                <div className="flex gap-2 mt-4 justify-end">
                  <button 
                    onClick={() => handleReviewStatus(review._id, 'rejected')}
                    className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <XCircle size={14} /> Refuser
                  </button>
                  <button 
                    onClick={() => handleReviewStatus(review._id, 'approved')}
                    className="flex items-center gap-1.5 px-4 py-2 border border-green-200 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <CheckCircle size={14} /> Approuver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
