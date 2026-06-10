/**
 * ============================================================
 * 🖤🤍 CSS STORE — SCRIPT D'INSERTION DES 29 PRODUITS HUMMEL
 * Source : hummel.tn (scraping automatique)
 * Catégories : Matchwear | Streetwear | Accessoires | Collector
 * ============================================================
 * Usage : node css-store-backend/scripts/seedProducts.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGO_URI;

// ============================================================
// Mapping des catégories hummel.tn → catégories CSS Store
// ============================================================
function mapCategory(hummelCat, productName) {
  const name = productName.toLowerCase();
  if (name.includes('maillot') || name.includes('tenue') || name.includes('jersey')) return 'Matchwear';
  if (name.includes('t-shirt') || name.includes('t shirt') || name.includes('polo') || name.includes('legging') || name.includes('sac')) return 'Streetwear';
  if (name.includes('fanion') || name.includes('porte') || name.includes('chaussette')) return 'Accessoires';
  if (name.includes('anniversaire') || name.includes('98') || name.includes('replica')) return 'Collector';
  if (hummelCat === 'maillots-officiels-css') return 'Matchwear';
  if (hummelCat === 'Accessoires-css-Tunisie' || hummelCat === 'accessoires') return 'Accessoires';
  if (hummelCat === 'Destock-Tunisie') return 'Matchwear';
  return 'Streetwear';
}

// ============================================================
// Parse le prix TND "59,900 TND" → 59.9
// ============================================================
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/[^\d,]/g, '').replace(',', '.'));
}

// ============================================================
// Stock estimé selon nombre de tailles disponibles
// ============================================================
function estimateStock(sizes) {
  return sizes.length * 10;
}

// ============================================================
// Les 29 produits CSS récupérés sur hummel.tn
// ============================================================
const hummelProducts = [
  {
    name: "Legging Hml Court CSS - Noir",
    price: "59,900 TND",
    reference: "T91203 CSS-2002",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["M", "L"],
    coverUrl: "https://www.hummel.tn/150497-large_default/legging-hml-court-css.jpg",
    isFeatured: false
  },
  {
    name: "T-shirt Débardeur Training CSS - Blanc",
    price: "49,900 TND",
    reference: "T911050 CSS-2001",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    coverUrl: "https://www.hummel.tn/147358-large_default/training-t-shirt-debardeur.jpg",
    isFeatured: false
  },
  {
    name: "T-shirt Débardeur Training CSS - Couleur",
    price: "49,900 TND",
    reference: "T911050 CSS-2006",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    coverUrl: "https://www.hummel.tn/147290-large_default/training-t-shirt-debardeur.jpg",
    isFeatured: false
  },
  {
    name: "Chaussettes de Football Leads CSS",
    price: "9,900 TND",
    reference: "T80203 CSS-8730",
    hummelCat: "Accessoires-css-Tunisie",
    sizes: ["28/32", "32/35", "36/39", "40/45"],
    coverUrl: "https://www.hummel.tn/140944-large_default/chaussettes-leads-hummel-foot-chausshumfoot.jpg",
    isFeatured: false
  },
  {
    name: "Legging Hml Court CSS - Blanc",
    price: "59,900 TND",
    reference: "T91203 CSS-7126",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["S", "M", "L", "XL", "XXL"],
    coverUrl: "https://www.hummel.tn/150498-large_default/legging-hml-court-css.jpg",
    isFeatured: false
  },
  {
    name: "Sac à Dos Hml Master CSS",
    price: "99,900 TND",
    reference: "T205900 CSS-2001",
    hummelCat: "Accessoires-css-Tunisie",
    sizes: ["TU"],
    coverUrl: "https://www.hummel.tn/165129-large_default/hml-master.jpg",
    isFeatured: false
  },
  {
    name: "T-Shirt Hammadi Agrebi Kids CSS - Blanc",
    price: "19,950 TND",
    reference: "T280600 JR-9001",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["4A", "6A", "8A", "10A", "12A", "14A", "16A"],
    coverUrl: "https://www.hummel.tn/151247-large_default/t-shirt-hammadi-agrebi-kidscss.jpg",
    isFeatured: false
  },
  {
    name: "Maillot Officiel CSS 3 - Saison 2022/2023 - Rouge",
    price: "79,900 TND",
    reference: "T201924-3062",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    coverUrl: "https://www.hummel.tn/147355-large_default/three-jersey-css-officiel-3.jpg",
    isFeatured: true
  },
  {
    name: "Fanions CSS Gold",
    price: "5,900 TND",
    reference: "ACCESS0001-111",
    hummelCat: "Accessoires-css-Tunisie",
    sizes: ["TU"],
    coverUrl: "https://www.hummel.tn/141460-large_default/fanions-css-gold.jpg",
    isFeatured: false
  },
  {
    name: "Polo Authentic Functional CSS - Blanc",
    price: "59,900 TND",
    reference: "T219991-9001",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    coverUrl: "https://www.hummel.tn/151310-large_default/authentic-functional-polo-cs.jpg",
    isFeatured: false
  },
  {
    name: "Fanions CSS Noir et Blanc",
    price: "5,900 TND",
    reference: "ACCESS0002-111",
    hummelCat: "Accessoires-css-Tunisie",
    sizes: ["TU"],
    coverUrl: "https://www.hummel.tn/164827-large_default/fanions-css-noir-et-blanc.jpg",
    isFeatured: false
  },
  {
    name: "Maillot Officiel 4 CSS 25/26 - 3rd Jersey",
    price: "99,900 TND",
    reference: "T193803-2001",
    hummelCat: "maillots-officiels-css",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"],
    coverUrl: "https://www.hummel.tn/167059-large_default/css-3rd-jersey-25-26.jpg",
    isFeatured: true
  },
  {
    name: "Porte Multi Carte L CSS Officiel - Noir",
    price: "12,900 TND",
    reference: "TPU105-2001",
    hummelCat: "Accessoires-css-Tunisie",
    sizes: ["TU"],
    coverUrl: "https://www.hummel.tn/142955-large_default/porte-multi-carte-l-css.jpg",
    isFeatured: false
  },
  {
    name: "T-Shirt Hammadi Agrebi CSS - Blanc",
    price: "49,900 TND",
    reference: "T280600-9001",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    coverUrl: "https://www.hummel.tn/151252-large_default/t-shirt-hammadi-agrebi-css.jpg",
    isFeatured: false
  },
  {
    name: "Tenue Kids 3 CSS 25/26",
    price: "99,900 TND",
    reference: "T193815-6001",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["2A", "4A", "6A", "8A", "10A", "12A", "14A", "16A"],
    coverUrl: "https://www.hummel.tn/165571-large_default/tenue-kids3-css-25-26.jpg",
    isFeatured: false
  },
  {
    name: "Maillot Anniversaire 98 CSS",
    price: "129,000 TND",
    reference: "T193816-2011",
    hummelCat: "css",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    coverUrl: "https://www.hummel.tn/167507-large_default/maillot-anniversaire-98-css.jpg",
    isFeatured: true
  },
  {
    name: "Maillot Gardien 2026 CSS",
    price: "99,900 TND",
    reference: "T193817-2711",
    hummelCat: "maillots-officiels-css",
    sizes: ["S", "M", "L", "XL", "XXL"],
    coverUrl: "https://www.hummel.tn/167907-large_default/maillot-gardien-2026-css.jpg",
    isFeatured: false
  },
  {
    name: "Maillot 98 CSS Replica",
    price: "99,900 TND",
    reference: "T193819-2011",
    hummelCat: "maillots-officiels-css",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    coverUrl: "https://www.hummel.tn/167858-large_default/maillot-98-css-replica.jpg",
    isFeatured: true
  },
  {
    name: "Maillot Officiel 2 CSS 25/26 - Extérieur",
    price: "87,920 TND",
    reference: "T193802-9001",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    coverUrl: "https://www.hummel.tn/161059-large_default/maillot-officiel-2-css-2526-home-jersey.jpg",
    isFeatured: true
  },
  {
    name: "Maillot Officiel 1 CSS 25/26 - Domicile",
    price: "87,920 TND",
    reference: "T193801-2001",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"],
    coverUrl: "https://www.hummel.tn/161062-large_default/maillot-officiel-1-css-2526-home-jersey.jpg",
    isFeatured: true
  },
  {
    name: "Tenue Kids 1 CSS 25/26",
    price: "99,900 TND",
    reference: "T193813-2001",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["2A", "4A", "6A", "8A", "10A", "12A", "14A", "16A"],
    coverUrl: "https://www.hummel.tn/161708-large_default/tenue-kids1-css-25-26.jpg",
    isFeatured: false
  },
  {
    name: "T-Shirt Hammadi Agrebi Kids CSS - Noir",
    price: "19,950 TND",
    reference: "T280600 JR-2001",
    hummelCat: "Destock-Tunisie",
    sizes: ["4A", "6A", "8A", "10A", "12A", "14A", "16A"],
    coverUrl: "https://www.hummel.tn/151244-large_default/t-shirt-hammadi-agrebi-kidscss.jpg",
    isFeatured: false
  },
  {
    name: "Tenue Kids 2 CSS - Blanc",
    price: "99,900 TND",
    reference: "T193814-9001",
    hummelCat: "Textiles-css-Tunisie",
    sizes: ["2A", "4A", "6A", "8A", "10A", "12A", "14A"],
    coverUrl: "https://www.hummel.tn/167229-large_default/tenue-kids2-css.jpg",
    isFeatured: false
  },
  {
    name: "Maillot CSS Domicile 23/24 - Officiel 1",
    price: "26,970 TND",
    reference: "T201935-2001",
    hummelCat: "Destock-Tunisie",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    coverUrl: "https://www.hummel.tn/147252-large_default/home-jersey-css-23-24-officiel-1.jpg",
    isFeatured: false
  },
  {
    name: "Porte Carte Crédit CSS - Noir",
    price: "6,900 TND",
    reference: "TPU107-2001",
    hummelCat: "accessoires",
    sizes: ["TU"],
    coverUrl: "https://www.hummel.tn/147360-large_default/porte-carte-grise-css.jpg",
    isFeatured: false
  },
  {
    name: "Porte Carte S CSS - Noir",
    price: "3,500 TND",
    reference: "TPU106-2001",
    hummelCat: "accessoires",
    sizes: ["TU"],
    coverUrl: "https://www.hummel.tn/142959-large_default/porte-carte-s-css.jpg",
    isFeatured: false
  },
  {
    name: "Maillot Officiel 1 CSS 24/25 - Domicile",
    price: "49,950 TND",
    reference: "T192801-2001",
    hummelCat: "Destock-Tunisie",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"],
    coverUrl: "https://www.hummel.tn/143446-large_default/css-home-jersey-24-25-maillot-officiel-1.jpg",
    isFeatured: false
  },
  {
    name: "T-Shirt Palestine Kids CSS - Blanc",
    price: "19,950 TND",
    reference: "T280601 JR-9001",
    hummelCat: "Destock-Tunisie",
    sizes: ["4A", "6A", "8A", "10A", "12A", "14A", "16A"],
    coverUrl: "https://www.hummel.tn/151260-large_default/t-shirt-palestine-kids-css.jpg",
    isFeatured: false
  },
  {
    name: "Maillot CSS Officiel 1 - Dos Simple 2022/2023",
    price: "34,950 TND",
    reference: "T201927-2001",
    hummelCat: "Destock-Tunisie",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    coverUrl: "https://www.hummel.tn/147375-large_default/maillot-css-officiel-1.jpg",
    isFeatured: false
  }
];

// ============================================================
// Descriptions générées par catégorie
// ============================================================
function generateDescription(name, category, reference) {
  const descriptions = {
    Matchwear: `Maillot et tenue officielle du Club Sportif Sfaxien. Fabriqué par Hummel avec des matériaux techniques haute performance pour le confort sur le terrain. Référence officielle : ${reference}.`,
    Streetwear: `Article textile officiel CSS by Hummel. Confort et style aux couleurs du Club Sportif Sfaxien. Idéal pour les supporters. Référence : ${reference}.`,
    Accessoires: `Accessoire officiel du Club Sportif Sfaxien signé Hummel. Parfait pour afficher votre soutien aux Noir et Blanc. Référence : ${reference}.`,
    Collector: `Édition collector officielle CSS by Hummel. Pièce exclusive pour les grands supporters du Club Sportif Sfaxien. Référence : ${reference}.`
  };
  return descriptions[category] || descriptions.Streetwear;
}

// ============================================================
// Script principal
// ============================================================
async function seedProducts() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Supprimer les anciens produits
    const deleted = await Product.deleteMany({});
    console.log(`🗑️  ${deleted.deletedCount} anciens produits supprimés\n`);

    // Transformer et insérer les nouveaux produits
    const productsToInsert = hummelProducts.map(p => {
      const category = mapCategory(p.hummelCat, p.name);
      const price = parsePrice(p.price);
      return {
        name: p.name,
        price,
        description: generateDescription(p.name, category, p.reference),
        images: [p.coverUrl],
        category,
        sizes: p.sizes,
        reference: p.reference,
        isFeatured: p.isFeatured,
        stock: estimateStock(p.sizes)
      };
    });

    const inserted = await Product.insertMany(productsToInsert);
    
    console.log(`✅ ${inserted.length} produits CSS insérés avec succès !\n`);
    console.log('📦 Récapitulatif par catégorie :');
    
    const byCategory = {};
    productsToInsert.forEach(p => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    });
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} produits`);
    });

    console.log('\n🏆 Liste des produits ajoutés :');
    inserted.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name} — ${p.price} TND — ${p.category}`);
    });

    console.log('\n🎉 Seed terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error.message);
    process.exit(1);
  }
}

seedProducts();
