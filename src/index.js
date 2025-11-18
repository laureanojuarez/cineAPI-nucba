import express from "express";
import dotenv from "dotenv";
import cors from "cors";

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

  app.post("/make-admin", async (req, res) => {
  try {
    const { email } = req.body;
    const Usuario = sequelize.models.Usuario;
    
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    user.role = "admin";
    await user.save();
    
    res.json({ message: "Admin creado exitosamente", email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
