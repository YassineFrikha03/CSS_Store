const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Informations personnelles de base
  name: { 
    type: String, 
    required: [true, "Le nom complet est obligatoire"] 
  },
  email: { 
    type: String, 
    required: [true, "L'adresse e-mail est obligatoire"], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, "Le mot de passe est obligatoire"] 
  },
  
  // Gestion fine des statuts et des droits d'accès
  role: { 
    type: String, 
    enum: ['supporter', 'premium_subscriber', 'admin'], 
    default: 'supporter' 
  },
  
  phoneNumber: { 
    type: String,
    trim: true 
  },
  
  // Structure complète pour la livraison des colis en Tunisie
  shippingAddress: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'Tunisia' }
  },

  // Authentification Biométrique (FaceID)
  hasFaceId: {
    type: Boolean,
    default: false
  },
  faceDescriptor: {
    type: [Number],
    default: []
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Liste de souhaits connectée dynamiquement à la collection Product
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }]
}, { 
  // Génère automatiquement les champs createdAt et updatedAt en base
  timestamps: true 
});

// ⚡ L'EXPORTATION MONGOOSE EXPLICITE ET PROPRE
// C'est cette ligne exacte qui rend les méthodes comme .findOne() et .create() disponibles
module.exports = mongoose.model('User', UserSchema);