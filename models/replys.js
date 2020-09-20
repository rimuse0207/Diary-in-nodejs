module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "replys",
    {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      timestamps: true
      //paranoid: true
    }
  );
