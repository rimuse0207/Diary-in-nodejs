module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "posts",
    {
      public: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      content: {
        type: DataTypes.STRING(140),
        allowNull: false
      },
      img: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      timestamps: true
      //paranoid: true
    }
  );
