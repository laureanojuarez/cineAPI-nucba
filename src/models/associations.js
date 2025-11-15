import User from "./User.js";
import Movie from "./Movie.js";
import Sala from "./Sala.js";
import Seat from "./Seat.js";
import Reserva from "./Reserva.js";
import Funcion from "./Funcion.js";
import ButacaFuncion from "./ButacaFuncion.js";

export function applyAssociations() {
  // Sala -> Seat
  Sala.hasMany(Seat, { foreignKey: "salaId", as: "Seats", onDelete: "CASCADE", hooks: true });
  Seat.belongsTo(Sala, { foreignKey: "salaId" });

  // Movie -> Funcion
  Movie.hasMany(Funcion, { foreignKey: "movieId", onDelete: "CASCADE", hooks: true });
  Funcion.belongsTo(Movie, { foreignKey: "movieId" });

  // Sala -> Funcion
  Sala.hasMany(Funcion, { foreignKey: "salaId", onDelete: "CASCADE", hooks: true });
  Funcion.belongsTo(Sala, { foreignKey: "salaId" });

  // Funcion -> ButacaFuncion
  Funcion.hasMany(ButacaFuncion, { foreignKey: "funcionId", onDelete: "CASCADE", hooks: true });
  ButacaFuncion.belongsTo(Funcion, { foreignKey: "funcionId" });

  // Seat -> ButacaFuncion (solo UNA vez)
  Seat.hasMany(ButacaFuncion, { foreignKey: "seatId", onDelete: "CASCADE", hooks: true });
  ButacaFuncion.belongsTo(Seat, { foreignKey: "seatId" });

  // User -> Reserva
  User.hasMany(Reserva, { foreignKey: "userId", onDelete: "CASCADE", hooks: true });
  Reserva.belongsTo(User, { foreignKey: "userId" });

  // Funcion -> Reserva (CON ALIAS)
  Funcion.hasMany(Reserva, { foreignKey: "funcionId", onDelete: "CASCADE", hooks: true, as: "reservas" });
  Reserva.belongsTo(Funcion, { foreignKey: "funcionId", as: "funcion" });

  // Seat -> Reserva (CON ALIAS)
  Seat.hasMany(Reserva, { foreignKey: "seatId" });
  Reserva.belongsTo(Seat, { foreignKey: "seatId", as: "seat" });
}