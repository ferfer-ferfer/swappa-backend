module.exports = (sequelize, DataTypes) => {
  const UserSkill = sequelize.define('UserSkill', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // ✅ Part of composite PK
    },
    skillId: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
    },
    type: {
      type: DataTypes.ENUM('teach', 'learn'),
      allowNull: false,
      primaryKey: true, 
    }
  }, {
    tableName: 'userskills',
    timestamps: false,
  });

  return UserSkill;
};
 
