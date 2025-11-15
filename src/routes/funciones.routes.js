import express from "express";
import { verifyToken } from "../middlewares/verify.middleware.js";
import { createFuncion, getFuncionesByMovie, getSeatsByFuncion } from "../controllers/funcion.controller.js";

const router = express.Router();

router.post("/", verifyToken, createFuncion);
router.get("/movie/:movieId", getFuncionesByMovie);
router.get("/:id/seats", getSeatsByFuncion);

export default router;