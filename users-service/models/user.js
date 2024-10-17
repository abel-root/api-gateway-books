'use strict';
const {
  Model
} = require('sequelize');
const books = require('./books');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Books,{
        through: "UserBooks",      // Table intermédiaire
        foreignKey: 'userId',      // Clé étrangère dans UserBooks pointant vers Users
        otherKey: 'bookId',        // Clé étrangère dans UserBooks pointant vers Books
        as: "books",               // Alias pour accéder aux livres associés
        onDelete: "CASCADE"
      });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.ENUM("othor","reader","admin")
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};