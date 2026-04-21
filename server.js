const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Variable de entorno
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Falta la variable MONGO_URI");
  process.exit(1);
}

// Conexión MongoDB
mongoose.connect(MONGO_URI)
.then(() => console.log("MongoDB conectado"))
.catch(err => console.error("Error de conexión:", err));

// Schema con validaciones
const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  category: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Product = mongoose.model("Product", ProductSchema);

// Obtener productos
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Crear producto
app.post('/products', async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || price == null || !category) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    if (price < 0) {
      return res.status(400).json({ error: "Precio inválido" });
    }

    const product = new Product({ name, price, category });
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar" });
  }
});

// Actualizar producto
app.put('/products/:id', async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || price == null || !category) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    if (price < 0) {
      return res.status(400).json({ error: "Precio inválido" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

// Eliminar producto
app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Producto eliminado" });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor en puerto " + PORT));