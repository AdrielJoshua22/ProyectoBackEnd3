import express from "express";
import ProductManager from "./managers/productManager.js";



const app = express();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const manager = new ProductManager("./src/files/products.json");


app.get("/products", async (req, res) => {
  const { limit } = req.query;
  const products = await manager.getProducts();
  if (limit) {
    const limited = products.slice(0, limit);
    res.status(200).json(limited);
  } else {
    res.status(200).json(products);
  }
});

app.get("/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.getProductsById(id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(400).json({ message: "Producto no encontrado" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});