import { Router } from "express";
import CartManager from "../manager/CartsManager.js";

const managers = new CartManager('carts.json');
const router = Router();

router.post('/', async (req, res) => 
{
    try 
    {
        const carritoAgregado = await managers.addCarts();
        res.status(201).json({ status: "success", message: "Carrito agregado satisfactoriamente", cart: carritoAgregado });
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:cid", async (req, res) => 
{
    const carrito_id = parseInt(req.params.cid);
    const carritoObjeto = await managers.getCartById(carrito_id);

    if (carritoObjeto) 
    {
        res.json(carritoObjeto);
    } 
    else 
    {
        res.status(400).json({ error: "Carrito no existe" });
    }
});

router.post('/:cid/product/:pid', async (req, res) => 
{
    const carrito_id = parseInt(req.params.cid);
    const producto_id = parseInt(req.params.pid);

    try 
    {
        const carritoActualizado = await managers.addProductToCart(carrito_id, producto_id);
        res.status(201).json({ status: "success", message: "Carrito y sus productos actualizados satisfactoriamente", cart: carritoActualizado });
    } 
    catch (error) 
    {
        res.status(500).json({ error: error.message });
    }
});

export default router;
