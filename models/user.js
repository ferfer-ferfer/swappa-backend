module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    ID_Users: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,  
      autoIncrement: true,
    },
    Users_name: {  // Renamed from 'username' to 'Users_name' to match your schema
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
    first_name: {  // Renamed to match the column name
      type: DataTypes.STRING,
    },
    last_name: {  // Renamed to match the column name
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
    SP: {  // Renamed to match the column name for SP points
      type: DataTypes.INTEGER,
      defaultValue: 0, 
    },
    profileCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {  // Added status column
      type: DataTypes.STRING,
       defaultValue: 'available'
    },
    total_time_teaching_h: {  // Renamed to match the column name
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    total_time_learning_h: {  // Renamed to match the column name
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    rate: {  // Added rate column
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    nbr_rate: {  // Added nbr_rate column
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sec_email: {  // Added sec_email column (sequential email?)
      type: DataTypes.STRING,
    },
    is_admin: {  // Renamed to match the column name
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {  // Renamed to match the column name
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {  // Renamed to match the column name
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    auth_provider: {  // Renamed to match the column name
      type: DataTypes.STRING,
      defaultValue: 'local',
    },
    provider_id: {  // Renamed to match the column name
      type: DataTypes.STRING,
      allowNull: true, 
    },language: {
      type: DataTypes.STRING,
      defaultValue: 'en'
    },
    dark_mode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

    
  }, {
    tableName: 'users',  // Ensure the table name matches
    timestamps: false,  // Set to false if `created_at` and `updated_at` are managed manually
  });

  return User;
};
