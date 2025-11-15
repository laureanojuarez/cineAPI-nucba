import sequelize from "../db.js";
import ButacaFuncion from "../models/ButacaFuncion.js";
import Funcion from "../models/Funcion.js";
import Reserva from "../models/Reserva.js";
import Sala from "../models/Sala.js";
import Seat from "../models/Seat.js";
import Movie from "../models/Movie.js";

export const reservarPelicula = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    console.log('👤 Usuario autenticado:', req.user);
    
    if (!req.user || !req.user.id) {
      await t.rollback();
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const userId = req.user.id;
    const { funcionId, seatIds, precio } = req.body;

    console.log('📝 Datos recibidos:', { userId, funcionId, seatIds, precio });

    if (!funcionId || !Array.isArray(seatIds) || seatIds.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: "funcionId y seatIds son obligatorios" });
    }

    console.log('🔍 Verificando función...');
    const funcion = await Funcion.findByPk(funcionId, { transaction: t });
    if (!funcion) {
      await t.rollback();
      return res.status(404).json({ error: "Función no encontrada" });
    }
    console.log('✅ Función encontrada');

    console.log('🔍 Buscando butacas...');
    // Quitar el lock por ahora para ver si ese es el problema
    const rows = await ButacaFuncion.findAll({ 
      where: { 
        funcionId: funcionId, 
        seatId: seatIds 
      }, 
      transaction: t
    });

    console.log('🪑 Butacas encontradas:', rows.length);

    if (rows.length !== seatIds.length) {
      await t.rollback();
      return res.status(400).json({ 
        error: "Algunos asientos no existen",
        encontrados: rows.length,
        solicitados: seatIds.length
      });
    }

    console.log('🔍 Verificando disponibilidad...');
    const noLibres = rows.filter(r => r.estado !== "libre");
    if (noLibres.length > 0) {
      await t.rollback();
      return res.status(409).json({ 
        error: `Algunos asientos ya están ocupados`,
        ocupados: noLibres.map(r => r.seatId)
      });
    }
    console.log('✅ Todos los asientos están libres');

    console.log('🔄 Actualizando estado de butacas...');
    for (const row of rows) {
      await row.update({ estado: "reservada" }, { transaction: t });
    }
    console.log('✅ Butacas actualizadas');

    console.log('💾 Creando reservas...');
    const reservas = [];
    for (const seatId of seatIds) {
      const reserva = await Reserva.create({ 
        userId, 
        funcionId, 
        seatId, 
        precio: Math.round(precio / seatIds.length) // Dividir el precio entre los asientos
      }, { transaction: t });
      reservas.push(reserva);
    }
    console.log('✅ Reservas creadas:', reservas.length);

    console.log('🔄 Haciendo commit...');
    await t.commit();
    console.log('✅ Commit exitoso');
    
    res.status(201).json({ 
      message: "Reserva exitosa", 
      reservas: reservas.length,
      asientos: seatIds
    });
  } catch (e) {
    console.error('❌ Error al reservar:', e);
    console.error('📋 Stack:', e.stack);
    await t.rollback();
    res.status(500).json({ error: "Error al reservar", detalle: e.message });
  }
};
export const getReservasByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const reservas = await Reserva.findAll({
      where: { userId },
      include: [
        { 
          model: Funcion, 
          as: "funcion",
          include: [
            { model: Sala },
            { model: Movie }
          ]
        },
        { model: Seat, as: "seat" }
      ],
      order: [["createdAt", "DESC"]],
    });
    
    res.json(reservas);
  } catch (error) {
    console.error('❌ Error al obtener reservas:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};