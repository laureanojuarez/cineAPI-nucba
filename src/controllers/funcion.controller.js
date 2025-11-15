import Funcion from "../models/Funcion.js";
import Sala from "../models/Sala.js";
import Seat from "../models/Seat.js";
import ButacaFuncion from "../models/ButacaFuncion.js";
import Movie from "../models/Movie.js";
import sequelize from "../db.js";

export const createFuncion = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { movieId, salaId, fecha, horario } = req.body;
    if (!movieId || !salaId || !fecha || !horario) {
      await t.rollback();
      return res.status(400).json({ error: "Faltan datos" });
    }

    const [movie, sala] = await Promise.all([
      Movie.findByPk(Number(movieId)),
      Sala.findByPk(Number(salaId)),
    ]);
    
    if (!movie) {
      await t.rollback();
      return res.status(404).json({ error: "Película no encontrada" });
    }
    if (!sala) {
      await t.rollback();
      return res.status(404).json({ error: "Sala no encontrada" });
    }

    console.log('🎬 Creando función para película:', movie.titulo);
    console.log('🏛️ En sala:', sala.nombre);

    const funcion = await Funcion.create({ 
      movieId: Number(movieId), 
      salaId: Number(salaId), 
      fecha, 
      horario 
    }, { transaction: t });

    console.log('✅ Función creada con ID:', funcion.id);

    const seats = await Seat.findAll({ 
      where: { salaId: Number(salaId) }, 
      transaction: t 
    });
    
    console.log('🪑 Asientos encontrados en la sala:', seats.length);
    
    if (!seats.length) {
      await t.rollback();
      return res.status(400).json({ error: "La sala no tiene asientos" });
    }

    const butacasData = seats.map(s => ({ 
      funcionId: funcion.id, 
      seatId: s.id, 
      estado: "libre" 
    }));

    console.log('📝 Preparando', butacasData.length, 'butacas para crear');
    console.log('🔍 Primera butaca:', butacasData[0]);

    const butacasCreadas = await ButacaFuncion.bulkCreate(butacasData, { 
      ignoreDuplicates: true, 
      transaction: t,
      returning: true
    });

    console.log('✨ Butacas creadas:', butacasCreadas.length);

    await t.commit();
    
    res.status(201).json({ 
      mensaje: "Función creada con éxito", 
      funcion,
      butacasCreadas: butacasCreadas.length
    });
  } catch (e) {
    await t.rollback();
    console.error('❌ Error al crear función:', e);
    res.status(500).json({ error: "Error al crear función", detalle: e.message });
  }
};

export const getFuncionesByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const funciones = await Funcion.findAll({ where: { movieId }, include: [{ model: Sala }] });
    res.json(funciones);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al listar funciones" });
  }
};
export const getSeatsByFuncion = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📍 Buscando asientos para función:', id);
    
    const funcion = await Funcion.findByPk(id);
    if (!funcion) return res.status(404).json({ error: "Función no encontrada" });

    console.log('✅ Función encontrada:', funcion.toJSON());

    // Verificar cuántos registros de ButacaFuncion existen
    const existingCount = await ButacaFuncion.count({ where: { funcionId: id } });
    console.log('📊 ButacaFuncion existentes para esta función:', existingCount);

    // Si no hay, crearlos AHORA
    if (existingCount === 0) {
      console.log('⚠️ No hay butacas, creando...');
      const seats = await Seat.findAll({ where: { salaId: funcion.salaId } });
      console.log('🪑 Asientos encontrados en sala:', seats.length);
      
      if (seats.length === 0) {
        return res.status(400).json({ error: "La sala no tiene asientos generados" });
      }
      
      const toCreate = seats.map(s => ({ 
        funcionId: Number(id), 
        seatId: s.id, 
        estado: "libre" 
      }));
      
      console.log('📝 Creando butacas:', toCreate.length);
      
      const created = await ButacaFuncion.bulkCreate(toCreate, { 
        ignoreDuplicates: true,
        returning: true 
      });
      
      console.log('✨ ButacaFuncion creadas:', created.length);
    }

    const rows = await ButacaFuncion.findAll({
      where: { funcionId: id },
      include: [{ model: Seat, required: true }],
      order: [[Seat, "fila", "ASC"], [Seat, "numero", "ASC"]],
    });

    console.log('📋 Rows encontradas después de crear:', rows.length);
    
    if (rows.length > 0) {
      console.log('🔍 Primera row:', rows[0]?.toJSON());
    }

    const Seats = rows
      .filter(x => x.seat)
      .map(x => ({
        id: x.seat.id,
        fila: x.seat.fila,
        numero: x.seat.numero,
        salaId: x.seat.salaId,
        disponible: x.estado === "libre",
      }));

    console.log('🎯 Seats a enviar:', Seats.length);

    res.json({ funcionId: Number(id), Seats });
  } catch (e) {
    console.error('❌ Error en getSeatsByFuncion:', e);
    res.status(500).json({ error: "Error al listar asientos de la función" });
  }
};