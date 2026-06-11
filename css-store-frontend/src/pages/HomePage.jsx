import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import CategoryCircles from '../components/CategoryCircles';
import ProductGrid from '../components/ProductGrid';
import PromoBanner from '../components/PromoBanner';
import TrustBadges from '../components/TrustBadges';
import ReviewsSection from '../components/ReviewsSection';
import Footer from '../components/Footer';

const HomePage = ({ currentCategory }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-[#F9F9F9]">
      {/* 1. Grand Banner Hero avec les joueurs du CSS et le blason de 1928 */}
      <HeroSlider />

      {/* 2. Les Bulles/Cartes de Catégories (Maillots, Écharpes, Accessoires...) */}
      <CategoryCircles />

      {/* 3. Section "PRODUITS POPULAIRES" (Grille de produits verticale avec prix et étoiles) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-200 pb-4">
          <h2 className="text-xl font-black uppercase tracking-wider text-black">Produits Populaires</h2>
          <button onClick={() => navigate('/textiles')} className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-black flex items-center gap-1 cursor-pointer">
            Voir Tout &rarr;
          </button>
        </div>
        <ProductGrid currentCategory={currentCategory} />
      </section>

      {/* 4. Bannière de Promotion de la semaine (-20%) */}
      <PromoBanner />

      {/* 5. Bandeau de réassurance (Livraison rapide, Paiement sécurisé...) */}
      <TrustBadges />

      {/* 6. Section "ILS NOUS FONT CONFIANCE" (Avis des supporters) */}
      <ReviewsSection />
    </div>
  );
};

export default HomePage;