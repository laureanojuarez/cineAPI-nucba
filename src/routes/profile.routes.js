import express from "express";
import {verifyToken} from "../middlewares/verify.middleware.js";
import {
  updatePassword,
  updateProfile,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.put("/", verifyToken, updateProfile);
router.put("/password", verifyToken, updatePassword);

export default router;
