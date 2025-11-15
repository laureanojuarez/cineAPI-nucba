import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ButacaFuncion = sequelize.define("butacafuncion", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  funcionId: { type: DataTypes.INTEGER, allowNull: false },
  seatId: { type: DataTypes.INTEGER, allowNull: false },
  estado: { type: DataTypes.ENUM("libre", "reservada", "ocupada"), defaultValue: "libre" },
}, {
  indexes: [{ unique: true, fields: ["funcionId", "seatId"] }],
});

export default ButacaFuncion;