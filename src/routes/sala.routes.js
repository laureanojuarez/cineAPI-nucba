import express from "express";
import {createSala, deleteSala, getAllSalas, getSalaById} from "../controllers/sala.controller.js";
import {verifyToken} from "../middlewares/verify.middleware.js";

const router = express.Router();

router.post('/', verifyToken, createSala)
router.delete("/", verifyToken, deleteSala);
router.get("/:id", getSalaById);
router.get("/", getAllSalas);

export default router;
