import User from "../models/User.js";
import bcrypt from "bcrypt";

export const updateProfile = async (req, res) => {
  try {
    const {nombre, apellido, fechaNacimiento, telefono, genero} =
      req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({message: "Usuario no encontrado"});
    }

    await User.update(
      {
      nombre,apellido, fechaNacimiento, telefono, genero
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    res.status(200).json({message: "Perfil actualizado correctamente"});
  } catch (error) {
    res.status(500).json({message: "Error al actualizar el perfil"});
  }
};

export const updatePassword = async (req, res) => {
  try {
    const {password, repeatPassword, newPassword} = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({message: "Usuario no encontrado"});
    }

    if (newPassword !== repeatPassword) {
      return res
        .status(400)
        .json({message: "Las nuevas contraseñas no coinciden"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({message: "La contraseña actual es incorrecta"});
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({message: "Contraseña actualizada correctamente"});
  } catch (error) {
    res.status(500).json({message: "Error al actualizar la contraseña"});
  }
};
