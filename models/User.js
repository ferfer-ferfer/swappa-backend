module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    ID_Users: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,  
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, 
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    birthday: {
      type: DataTypes.DATEONLY,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
    },
    telegram: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    discord: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true, 
      },
    },
    whatsapp: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    spPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0, 
    },
    profileCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, 
     },
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true, 
     },
    resetCode: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    provider: {
      type: DataTypes.STRING,
      defaultValue: 'local',
    },
    authProviderId: {
      type: DataTypes.STRING,
      allowNull: true, 
    }
  }, {
    tableName: 'users', 
    timestamps: true, 
  });

  return User;
};
