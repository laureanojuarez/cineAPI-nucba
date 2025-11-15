import Movie from "../models/Movie.js";

export const getPeliculas = async (req, res) => {
  try {
    const movies = await Movie.findAll({ order: [["titulo", "ASC"]] });
    res.json(movies);
  } catch (error) {
    console.error("Error al obtener películas:", error);
    res.status(500).json({ error: "Error al obtener películas" });
  }
};

export const getPeliculaById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);
    
    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    
    res.json(movie);
  } catch (error) {
    console.error("Error al obtener película:", error);
    res.status(500).json({ error: "Error al obtener película" });
  }
};

export const addPelicula = async (req, res) => {
  try {
    const { titulo, genero, duracion, poster } = req.body;

    if (!titulo || !genero || !duracion) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const movie = await Movie.create({ titulo, genero, duracion, poster });
    res.status(201).json({ message: "Película agregada", movie });
  } catch (error) {
    console.error("Error al agregar película:", error);
    res.status(500).json({ error: "Error al agregar película" });
  }
};

export const deletePelicula = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);

    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    await movie.destroy();
    res.json({ message: "Película eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar película:", error);
    res.status(500).json({ error: "Error al eliminar película" });
  }
};

export const updatePelicula = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, genero, duracion, poster } = req.body;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    await movie.update({ titulo, genero, duracion, poster });
    res.json({ message: "Película actualizada", movie });
  } catch (error) {
    console.error("Error al actualizar película:", error);
    res.status(500).json({ error: "Error al actualizar película" });
  }
};