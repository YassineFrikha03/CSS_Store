import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // 📝 États du formulaire - Catégorie initialisée à 'Matchwear' pour correspondre à la BDD
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Matchwear'); 
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // 📝 État pour l'édition
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur chargement produits:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // 1. Nettoyage du prix pour accepter les points et les virgules (ex: 59.900)
      const cleanedPrice = parseFloat(price.toString().replace(',', '.'));

      if (isNaN(cleanedPrice)) {
        toast.error("Veuillez saisir un prix numérique valide.");
        return;
      }

      // 2. Envoi du payload complet incluant la description requise par Mongoose
      const res = await axios.post('http://localhost:5000/api/products', {
        name,
        category, 
        price: cleanedPrice,
        stock: Number(stock),
        imageUrl: imageUrl.trim() || '', // Évite l'utilisation de placeholders externes défaillants
        description: "Produit officiel du Club Sportif Sfaxien conçu par Hummel. Confort optimal et qualité textile supérieure.",
        isFeatured: false
      });
      
      setShowModal(false);
      // Réinitialisation complète des champs
      setName(''); setCategory('Matchwear'); setPrice(''); setStock(''); setImageUrl('');
      setProducts([...products, res.data]);
      fetchProducts(); 
      toast.success("Produit ajouté avec succès au CSS Store ! 🖤🤍");
    } catch (err) {
      console.error("Détails de l'erreur 400 :", err.response?.data);
      toast.error(`Erreur de validation : ${err.response?.data?.message || "Données incorrectes ou champ manquant"}`);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const cleanedPrice = parseFloat(price.toString().replace(',', '.'));
      if (isNaN(cleanedPrice)) {
        toast.error("Veuillez saisir un prix numérique valide.");
        return;
      }

      const res = await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, {
        name,
        category,
        price: cleanedPrice,
        stock: Number(stock),
        imageUrl: imageUrl.trim() || ''
      });

      setShowModal(false);
      setEditingProduct(null);
      setName(''); setCategory('Matchwear'); setPrice(''); setStock(''); setImageUrl('');
      setProducts(products.map(p => (p._id === editingProduct._id ? res.data : p)));
      fetchProducts();
      toast.success("Produit mis à jour avec succès ! 🖤🤍");
    } catch (err) {
      toast.error(`Erreur lors de la mise à jour : ${err.response?.data?.message || "Données incorrectes"}`);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price);
    setStock(product.stock);
    setImageUrl(product.imageUrl || (product.images && product.images[0]) || '');
    setShowModal(true);
  };


  const handleDeleteProduct = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article du catalogue ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        fetchProducts();
        toast.success("Produit supprimé !");
      } catch (err) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  if (loading) return <p className="text-xs font-mono text-zinc-400 p-4">Chargement du catalogue...</p>;

  return (
    <div className="text-left">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-wider">Gestion du Stock ({products.length})</h2>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setName(''); setCategory('Matchwear'); setPrice(''); setStock(''); setImageUrl('');
            setShowModal(true);
          }}
          className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-zinc-800 transition-colors cursor-pointer rounded-md"
        >
          + Ajouter un produit
        </button>
      </div>

      {/* TABLEAU DES ARTICLES EN STOCK */}
      <div className="bg-white border border-zinc-200 overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200 font-bold uppercase text-zinc-500 text-[10px] tracking-wider">
              <th className="p-4 text-left">Produit</th>
              <th className="p-4 text-left">Catégorie</th>
              <th className="p-4 text-left">Prix</th>
              <th className="p-4 text-left">Quantité</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-medium">
            {products.map(item => (
              <tr key={item._id} className="hover:bg-zinc-50/50">
                <td className="p-4 text-black font-bold flex items-center gap-3">
                  {item.imageUrl || (item.images && item.images.length > 0) ? (
                    <img src={item.imageUrl || item.images[0]} alt="" className="w-8 h-8 object-contain bg-zinc-50 border border-zinc-100" />
                  ) : (
                    <div className="w-8 h-8 bg-zinc-900 text-white font-mono text-[9px] flex items-center justify-center font-black">CSS</div>
                  )}
                  {item.name}
                </td>
                <td className="p-4 text-zinc-500">{item.category}</td>
                <td className="p-4 font-mono font-bold">{Number(item.price).toFixed(3)} DT</td>
                <td className="p-4 font-mono">
                  <span className={item.stock <= 5 ? 'text-red-600 font-bold' : 'text-black'}>
                    {item.stock} pcs
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => openEditModal(item)}
                    className="text-black hover:text-zinc-600 font-bold uppercase text-[10px] tracking-wider cursor-pointer mr-4"
                  >
                    Éditer
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(item._id)}
                    className="text-red-600 hover:text-red-800 font-bold uppercase text-[10px] tracking-wider cursor-pointer"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE MINIMALISTE D'AJOUT/EDITION PRODUIT */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="relative bg-white border border-zinc-200 p-8 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest mb-4">
              {editingProduct ? 'Modifier l\'Article' : 'Nouvel Article Catalogue'}
            </h3>
            
            <div>
              <label className="block text-[9px] font-black uppercase text-zinc-400 mb-1">Nom du produit</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-black" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black uppercase text-zinc-400 mb-1">Catégorie</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-black">
                  <option value="Matchwear">Maillots (Matchwear)</option>
                  <option value="Accessoires">Accessoires</option>
                  <option value="Promotions">Promotions</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-zinc-400 mb-1">Prix (DT)</label>
                <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="ex: 87.920" required className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-black" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black uppercase text-zinc-400 mb-1">Stock Initial</label>
                <input type="number" value={stock} onChange={e => setStock(e.target.value)} required className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-zinc-400 mb-1">Lien Image URL</label>
                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="/src/assets/..." className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-black" />
              </div>
            </div>

            <button type="submit" className="w-full bg-black text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors cursor-pointer mt-2">
              {editingProduct ? 'Enregistrer les modifications' : 'Confirmer l\'ajout'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminStock;