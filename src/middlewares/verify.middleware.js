import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({message: "Unauthorized"});
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findByPk(decoded.user);
    if (!user) {
      return res.status(401).json({message: "Unauthorized"});
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({message: "Unauthorized"});
  }
};
