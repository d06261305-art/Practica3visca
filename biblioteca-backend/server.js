const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos del frontend
app.use(
  express.static(
    path.join(__dirname, "../biblioteca-frontend")
  )
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Biblioteca conectada a MongoDB Atlas"))
  .catch((error) => console.error("Error de conexion:", error.message));

const LibroSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    autor: { type: String, required: true, trim: true },
    genero: { type: String, required: true, trim: true },
    anio: { type: Number, required: true, min: 0 },
    estado: {
      type: String,
      enum: ["Disponible", "Prestado", "Reservado"],
      default: "Disponible"
    }
  },
  { timestamps: true }
);

const Libro = mongoose.model("Libro", LibroSchema);

// Mostrar index.html al entrar a la raíz
app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../biblioteca-frontend/index.html")
  );
});

app.get("/libros", async (req, res) => {
  const q = (req.query.q || "").trim();

  const filtro = q
    ? {
        $or: [
          { titulo: { $regex: q, $options: "i" } },
          { autor: { $regex: q, $options: "i" } },
          { genero: { $regex: q, $options: "i" } },
          { estado: { $regex: q, $options: "i" } }
        ]
      }
    : {};

  const libros = await Libro.find(filtro).sort({ createdAt: -1 });

  res.json(libros);
});

app.get("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);

    if (!libro) {
      return res.status(404).json({ mensaje: "Libro no encontrado" });
    }

    res.json(libro);
  } catch {
    res.status(400).json({ mensaje: "ID invalido" });
  }
});

app.post("/libros", async (req, res) => {
  try {
    const libro = await Libro.create(req.body);

    res.status(201).json({
      mensaje: "Libro registrado",
      libro
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Datos invalidos",
      detalle: error.message
    });
  }
});

app.put("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!libro) {
      return res.status(404).json({
        mensaje: "Libro no encontrado"
      });
    }

    res.json({
      mensaje: "Libro actualizado",
      libro
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "No se pudo actualizar",
      detalle: error.message
    });
  }
});

app.delete("/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findByIdAndDelete(req.params.id);

    if (!libro) {
      return res.status(404).json({
        mensaje: "Libro no encontrado"
      });
    }

    res.json({
      mensaje: "Libro eliminado"
    });
  } catch {
    res.status(400).json({
      mensaje: "No se pudo eliminar"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de biblioteca en puerto ${PORT}`);
});