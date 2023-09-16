// router/views.router.js
import express from 'express';
import exphbs from 'express-handlebars';
import ProductManager from "../manager/ProductManager.js";

const managers = new ProductManager('products.json');
const router = express.Router();
const hbs = exphbs.create();

router.get('/', async (req, res) => {
  try {
    const productos = await managers.getProducts();

    res.render('home', { productos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la lista de productos');
  }
});

router.get('/realtimeproducts', async (req, res) => 
{
    const productos = await managers.getProducts();
    res.render('realTimeProducts', { productos }); 
});

export default router;