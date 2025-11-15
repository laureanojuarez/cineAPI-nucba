import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Seat = sequelize.define("seat", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fila: { type: DataTypes.STRING, allowNull: false },
  numero: { type: DataTypes.INTEGER, allowNull: false },
  salaId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  indexes: [{ unique: true, fields: ["salaId", "fila", "numero"] }],
});

export default Seat;