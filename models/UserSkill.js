module.exports = (sequelize, DataTypes) => {
    const UserSkill = sequelize.define('UserSkill', {
      type: {
        type: DataTypes.ENUM('teach', 'learn'),
        allowNull: false
      }
    }, {
      tableName: 'userskills'
    });
  
    return UserSkill;
  };
  
