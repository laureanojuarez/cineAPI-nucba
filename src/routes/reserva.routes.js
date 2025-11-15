import express from "express";
import {
  getReservasByUser,
  reservarPelicula,
} from "../controllers/reserva.controller.js";
import {verifyToken} from "../middlewares/verify.middleware.js";

const router = express.Router();

router.post("/", verifyToken, reservarPelicula);
router.get("/mis-entradas", verifyToken, getReservasByUser);

export default router;
