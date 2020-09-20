module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "users",
    {
      email: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      timestamps: true
    }
  );
