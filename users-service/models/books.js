'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Books.belongsToMany(models.User,{
        through: "UserBooks",      // Table intermédiaire
        foreignKey: 'bookId',      // Clé étrangère dans UserBooks pointant vers Books
        otherKey: 'userId',        // Clé étrangère dans UserBooks pointant vers Users
        as: "users",               // Alias pour accéder aux utilisateurs associés
        onDelete: "CASCADE"
      })
    }
  }
  Books.init({
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    about: DataTypes.STRING,
    pub_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Books',
  });
  return Books;
};