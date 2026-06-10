const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true }, // Prix figé au moment de l'achat
    size: String
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: Object,
  paymentMethod: { type: String, enum: ['COD', 'Card'], default: 'COD' }, // COD = Cash on Delivery (Paiement à la livraison)
  status: { type: String, enum: ['En attente', 'Préparation', 'Expédié', 'Livré', 'Annulé'], default: 'En attente' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);