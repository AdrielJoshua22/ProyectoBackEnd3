import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const managers = new ProductManager('products.json');
const router = Router();

router.get('/', async (req, res) => 
{
    try {
        const limit = req.query.limit; 
        let productos = await managers.getProducts();

        if (limit) {
            const parsedLimit = parseInt(limit);
            if (!isNaN(parsedLimit)) {
                productos = productos.slice(0, parsedLimit);
            } else {
                return res.status(400).json({ error: 'El valor de "limit" debe ser un número entero válido' });
            }
        }

        res.json(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get("/:pid", async (req,res)=>
{
    const producto_id = parseInt(req.params.pid);
    const productoObjeto = await managers.getProductById(producto_id);

    if(productoObjeto)
    {
        res.json(productoObjeto);
    }else 
    {
        res.status(400).json({error: "producto no existe"});
    }
})

router.post("/", async (req, res) => {
    try {
      const product = await managers.addProduct(req.body);
      if (product === "The insert code already exists") {
        res.status(400).json({ message: "Error al crear el producto", product });
      } else if (product === "Complete all fields") {
        res.status(400).json({ message: "Error al crear el producto", product });
      } else {

        const port = process.env.PORT || 8080;
        const redirectURL = `${req.protocol}://${req.hostname}:${port}/realtimeproducts`;
        res.redirect(redirectURL);
      }
    } catch (error) {
      throw new error("Error al crear el producto", error);
    }
  });


router.put("/:pid", async (req, res) => 
{
    const producto_id = parseInt(req.params.pid);
    const updateProducto = req.body;

    try {
        const productoActualizado = await managers.updateProduct(updateProducto,producto_id);

        res.status(201).json({ status: "success", message: "Producto actualizado satisfactoriamente", product: productoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

router.delete("/:pid", async (req, res) => 
{
    const producto_id = parseInt(req.params.pid);

    try {
        const productoEliminado = await managers.deleteProduct(producto_id);

        res.status(201).json({ status: "success", message: "Producto eliminado satisfactoriamente", product: productoEliminado });

        const port = process.env.PORT || 8080;
        const redirectURL = `${req.protocol}://${req.hostname}:${port}/realtimeproducts`;
        res.redirect(redirectURL);
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});


export default router;