import express from "express";
import {
  addPelicula,
  deletePelicula,
  getPeliculaById,
  getPeliculas,
  updatePelicula,
} from "../controllers/peliculas.controller.js";
import {verifyToken} from "../middlewares/verify.middleware.js";

const router = express.Router();

router.post("/", verifyToken, addPelicula); // Agregar Pelicula
router.delete("/:id", verifyToken, deletePelicula); // Eliminar Pelicula
router.put("/:id", verifyToken, updatePelicula); // Editar Pelicula

router.get("/", getPeliculas); // Obtener todas las Peliculas
router.get("/:id", getPeliculaById); // Obtener Pelicula por ID

export default router;
