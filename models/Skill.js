module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
      tableName: 'skill',
    });

  Skill.associate = (models) => {
    Skill.belongsToMany(models.User, {
      through: models.UserSkill,
      foreignKey: 'skillId',
      otherKey: 'userId'
    })
  };

  return Skill;
};

