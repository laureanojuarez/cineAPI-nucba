import {DataTypes} from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define("user", {
  email: {type: DataTypes.STRING, unique: true, allowNull: false},
  password: {type: DataTypes.STRING, allowNull: false},
  nombre: {type: DataTypes.STRING, allowNull: true},
  apellido: {type: DataTypes.STRING, allowNull: true},
  fechaNacimiento: {type: DataTypes.DATE, allowNull: true},
  telefono: {type: DataTypes.STRING, allowNull: true},
  genero: {type: DataTypes.STRING, allowNull: true},
  role: {type: DataTypes.STRING, defaultValue: "user"},
  createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
  updatedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
});

export default User;
