import express from "express";
import authRoutes from "./routes/auth.routes.js";
import peliculasRoutes from "./routes/peliculas.routes.js";
import reservaRoutes from "./routes/reserva.routes.js";
import salaRoutes from "./routes/sala.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import funcionesRoutes from "./routes/funciones.routes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import sequelize from "./db.js";
import { applyAssociations } from "./models/associations.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

applyAssociations(sequelize);

// Routes
app.use("/auth", authRoutes);
app.use("/peliculas", peliculasRoutes);
app.use("/salas", salaRoutes);
app.use("/reservas", reservaRoutes);
app.use("/profile", profileRoutes);
app.use("/funciones", funcionesRoutes); 

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");

  await sequelize.sync({alter: true});
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
