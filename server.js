const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//  Variable de entorno (Railway)
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(" Falta MONGO_URI");
  process.exit(1);
}

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
.then(() => console.log("✅ MongoDB conectado"))
.catch(err => console.error(" Error MongoDB:", err));

// Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", ProductSchema);

// Rutas

// Obtener productos
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Crear producto
app.post('/products', async (req, res) => {
  try {
    console.log(" Recibido:", req.body);

    const product = new Product(req.body);
    await product.save();

    res.json(product);
  } catch (error) {
    console.error(" Error guardando:", error);
    res.status(500).json({ error: "Error al guardar" });
  }
});

// Eliminar producto
app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Producto eliminado" });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(" Servidor en puerto " + PORT));