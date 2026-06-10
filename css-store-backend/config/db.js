const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Dans les versions récentes, pas besoin de useNewUrlParser ni de useUnifiedTopology !
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`=========================================`);
    console.log(` 🖤🤍 Base de données CSS Store Connectée !`);
    console.log(` Hôte : ${conn.connection.host}`);
    console.log(` Base : ${conn.connection.name}`);
    console.log(`=========================================`);
  } catch (error) {
    console.error(`❌ Erreur de connexion critique : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;