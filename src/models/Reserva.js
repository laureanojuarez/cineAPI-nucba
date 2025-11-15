import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Reserva = sequelize.define("reserva", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  funcionId: { type: DataTypes.INTEGER, allowNull: false },
  seatId: { type: DataTypes.INTEGER, allowNull: false },
  precio: { type: DataTypes.INTEGER, allowNull: true },
});

export default Reserva;