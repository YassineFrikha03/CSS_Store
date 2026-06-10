import React from 'react';

const ReviewsSection = () => {
  const reviews = [
    { name: "Yassine K.", city: "Sfax", text: "Très bonne qualité du maillot et livraison rapide." },
    { name: "Mohamed A.", city: "Tunis", text: "Produits officiels et service client au top !" },
    { name: "Ahmed B.", city: "Sfax", text: "Fier de porter les couleurs de notre club 🖤🤍" }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-200 pb-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-black">Ils nous font confiance</h2>
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-black cursor-pointer">Voir tous les avis &rarr;</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div key={idx} className="bg-white p-6 border border-zinc-100 shadow-sm flex flex-col justify-between">
            <p className="text-xs text-zinc-600 italic font-light leading-relaxed">"{rev.text}"</p>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-zinc-50">
              <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-xs font-mono text-zinc-700">
                {rev.name[0]}
              </div>
              <div>
                <h4 className="text-xs font-bold text-black">{rev.name}</h4>
                <p className="text-[10px] text-zinc-400 font-mono uppercase">{rev.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;