import {validateLoginUser} from "../helpers/validations.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({message: "All fields are required"});
    }

    const result = validateLoginUser({email, password});
    if (result.error) {
      return res.status(400).json({message: result.message});
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(400).json({message: "User already exists"});
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.json(newUser.id);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({error: error.message});
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log("Login request body:", req.body);
    const result = validateLoginUser(req.body);

    if (result.error) {
      return res.status(400).json({message: result.message});
    }

    const {email, password} = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({message: "Usuario o contraseña inválidos"});
    }

    const comparison = await bcrypt.compare(password, user.password);

    if (!comparison) {
      return res.status(400).json({message: "Email y/o contraseña incorrecta"});
    }

    const token = jwt.sign(
      {
        user: user.id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({token});
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({error: error.message});
  }
};

export const getCurrentUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findByPk(userId, {
      attributes: [
        "id",
        "nombre",
        "apellido",
        "email",
        "fechaNacimiento",
        "telefono",
        "role",
      ],
    });
    if (!user) return res.status(404).json({message: "User not found"});
    res.json(user);
  } catch (error) {
    res.status(500).json({message: "Server error"});
  }
};
