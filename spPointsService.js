const User = require('../models/User');
const SPTransaction = require('../models/SPTransaction');

const spPointsService = {
  // Ajouter des points SP à un utilisateur
  addPoints: async (userId, points, description) => {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    user.spPoints += points;
    await user.save();

    // Créer une nouvelle transaction SP
    await SPTransaction.create({
      userId: user.id,
      points: points,
      description: description
    });
  }
};

module.exports = spPointsService;
