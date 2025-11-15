import Reserva from "../models/Reserva.js";
import Sala from "../models/Sala.js";
import Seat from "../models/Seat.js";

export const createSala = async (req, res) => {
  try {
    const { nombre, capacidad } = req.body;
    if (!nombre || !capacidad) return res.status(400).json({ error: "nombre y capacidad son obligatorios" });

    const sala = await Sala.create({ nombre, capacidad: Number(capacidad) });

    const porFila = 10;
    const filas = Math.ceil(sala.capacidad / porFila);
    const seats = [];
    for (let i = 0; i < filas; i++) {
      const fila = String.fromCharCode(65 + i);
      for (let n = 1; n <= porFila; n++) {
        const ord = i * porFila + n;
        if (ord > sala.capacidad) break;
        seats.push({ fila, numero: n, salaId: sala.id });
      }
    }
    if (seats.length) await Seat.bulkCreate(seats);

    res.status(201).json({ sala, seatsCreados: seats.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear sala" });
  }
};

export const deleteSala = async (req, res) => {
  try {
    const {salaId} = req.body;
    if (!salaId) {
      return res.status(400).json({error: "Faltan datos obligatorios"});
    }

    const existSala = await Sala.findByPk(salaId);
    if (!existSala) {
      return res.status(404).json({error: "La sala no existe"});
    }

    await Seat.destroy({where: {salaId: existSala.id}});
    await Sala.destroy({where: {id: existSala.id}});

    res.status(200).json({message: "Sala eliminada correctamente"});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Error interno del servidor"});
  }
};

export const getSalaById = async (req, res) => {
  try {
    const {id} = req.params;
    if (!id) return res.status(400).json({error: "Falta el parametro id"});

   const sala = await Sala.findByPk(parseInt(id), {
      include: [
        {
          model: Seat,
          as: "Seats",
          include: [{model: Reserva, as: "Reservas"}]
        }
      ]
    });

    if (!sala) {
      return res.status(404).json({error: "Sala no encontrada"});
    }

   const seats = sala.Seats.map((seat) => {
      const ocupado = seat.Reservas && seat.Reservas.length > 0;
      return { ...seat.toJSON(), disponible: !ocupado };
    });

    res.json({ ...sala.toJSON(), Seats: seats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getAllSalas = async (req, res) => {
  try {
    const salas = await Sala.findAll({
      include: [{ model: Seat, as: "Seats" }]
    });
    
    const resumen = salas.map(s => ({
      id: s.id,
      nombre: s.nombre,
      capacidad: s.capacidad,
      asientosCreados: s.Seats?.length || 0
    }));
    
    console.log('🏛️ Salas con asientos:', resumen);
    res.json(resumen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar salas" });
  }
};
    
 
