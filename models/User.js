module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    ID_Users: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,  
      autoIncrement: true,
    },
    Users_name: {  
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, 
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {  
      type: DataTypes.STRING,
    },
    last_name: {  
      type: DataTypes.STRING,
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
    SP: {  
      type: DataTypes.INTEGER,
      defaultValue: 0, 
    },
    status: { 
      type: DataTypes.STRING,
    },
    total_time_teaching_h: {  
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    total_time_learning_h: { 
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    rate: {  
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    nbr_rate: { 
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sec_email: {  
      type: DataTypes.STRING,
    },
    is_admin: {  
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {  
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {  
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    auth_provider: {  
      type: DataTypes.STRING,
      defaultValue: 'local',
    },
    provider_id: {  
      type: DataTypes.STRING,
      allowNull: true, 
    }
  }, {
    tableName: 'users',  
    timestamps: false,  
  });

  return User;
};
