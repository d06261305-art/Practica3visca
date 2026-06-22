require("dotenv").config();

const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Conexion a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.log("Error MongoDB:", err));

// Esquema NoSQL de Mongoose
const ProductoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  existencia: Number
});

const Producto = mongoose.model("Producto", ProductoSchema);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// Obtener todos los productos
app.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener productos", error: err.message });
  }
});

// Insertar un nuevo producto
app.post("/productos", async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.json({ mensaje: "Producto registrado", nuevoProducto });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al registrar producto", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});