const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Relier à l'utilisateur

const SPTransaction = sequelize.define('SPTransaction', {
  points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Relation : Chaque transaction appartient à un utilisateur
SPTransaction.belongsTo(User);

module.exports = SPTransaction;
