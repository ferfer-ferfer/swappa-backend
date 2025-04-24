const express = require('express');
const sequelize = require('./config/database'); // Assure-toi d'avoir configuré ta base de données
const spController = require('./controllers/spController');

const app = express();
app.use(express.json());

// Routes des SP
app.use('/api/sp', spController);

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Serveur démarré sur le port ${PORT}`);

  // Synchroniser la base de données (création des tables si elles n'existent pas)
  await sequelize.sync();
});
