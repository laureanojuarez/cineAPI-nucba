import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Funcion = sequelize.define("funcion", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  horario: { type: DataTypes.TIME, allowNull: false },
  movieId: { type: DataTypes.INTEGER, allowNull: false },
  salaId: { type: DataTypes.INTEGER, allowNull: false },
});

export default Funcion;