const express = require('express');
const spPointsService = require('../services/spPointsService');
const User = require('../models/User');

const router = express.Router();

// Compléter le profil et attribuer des SP
router.put('/complete-profile', async (req, res) => {
  const { userId } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  if (user.profileCompleted) {
    return res.status(400).json({ message: 'Profil déjà complété' });
  }

  user.profileCompleted = true;
  await user.save();

  // Attribuer 5 SP
  await spPointsService.addPoints(user.id, 5, 'Complétion du profil');

  return res.status(200).json({ message: 'Profil complété ! +5 SP attribués.' });
});

// Vérifier le solde des SP
router.get('/balance/:userId', async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  return res.status(200).json({ spPoints: user.spPoints });
});

module.exports = router;
