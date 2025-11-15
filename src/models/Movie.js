import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Movie = sequelize.define("movie", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING, unique: true, allowNull: false },
  genero: { type: DataTypes.STRING, allowNull: false },
  duracion: { type: DataTypes.INTEGER, allowNull: false },
  poster: { type: DataTypes.STRING },
});

export default Movie;
