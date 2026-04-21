const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const path = require('path');
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

//  Conexión MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://CARLOS:car05mar05@parcial.kmgrjvb.mongodb.net/testdb?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
.then(() => {
  console.log(" MongoDB conectado");
})
.catch(err => {
  console.error(" Error de conexión:", err);
});

//  Schema de productos (SOLO UNA VEZ)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", ProductSchema);

//  Rutas

// Obtener productos
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Crear producto
app.post('/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Eliminar producto
app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Producto eliminado" });
});

//  Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor en puerto " + PORT));