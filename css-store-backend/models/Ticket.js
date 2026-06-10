const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  matchName: { type: String, required: true }, // Ex: "CSS vs EST"
  matchDate: { type: Date, required: true },
  zone: { type: String, enum: ['Gradins', 'Enceinte', 'Chaises', 'Tribune'], required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  isSubscriptionCard: { type: Boolean, default: false } // Si c'est un abonnement annuel
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);