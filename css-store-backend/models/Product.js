const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  // 🔄 Remplacement par un tableau pour accepter plusieurs photos
  images: [{ type: String, required: true }], 
  category: { 
    type: String, 
    required: true,
    enum: ['Matchwear', 'Streetwear', 'Accessoires', 'Collector'] 
  },
  sizes: [{ type: String }],
  reference: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);