import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";

// Routes
import authRoutes from "./routes/auth.routes.js";
import peliculasRoutes from "./routes/peliculas.routes.js";
import reservaRoutes from "./routes/reserva.routes.js";
import salaRoutes from "./routes/sala.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import funcionesRoutes from "./routes/funciones.routes.js";

// Database
import sequelize from "./db.js";
import { applyAssociations } from "./models/associations.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

applyAssociations(sequelize);

// Routes
app.use("/auth", authRoutes);
app.use("/peliculas", peliculasRoutes);
app.use("/salas", salaRoutes);
app.use("/reservas", reservaRoutes);
app.use("/profile", profileRoutes);
app.use("/funciones", funcionesRoutes);


// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    await sequelize.sync();

    // Crear usuario admin por defecto si no existe
    const Usuario = sequelize.models.User
    const adminExists = await Usuario.findOne({ where: { email: "admin@gmail.com" } });
    
    if (!adminExists) {
      const hashedPassword = bcrypt.hashSync("admin", 10);
      await Usuario.create({
        username: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin"
      });
      console.log("Usuario admin creado: admin@gmail.com / admin");
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

startServer();