import { Router } from "express";
import CartsManager from "../dao/mongo/managers/cartsManager.js";

const router = Router();
const cartsService = new CartsManager(); 

router.get("/:cid", async (req, res) => {
    const carrito_id = req.params.cid;

    try {
        const carritoObjeto = await cartsService.getCartsByIdWithProducts(carrito_id);

        if (carritoObjeto) {
            res.json(carritoObjeto);
        } else {
            res.status(400).json({ error: "Carrito no existe" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const carrito_id = req.params.cid;
    const producto_id = req.params.pid;

    try {
        const carritoActualizado = await cartsService.removeProductFromCart(carrito_id, producto_id);
        res.status(200).json({ status: "success", message: "Producto eliminado del carrito", cart: carritoActualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    const carrito_id = req.params.cid;
    const nuevosProductos = req.body.products;

    try {
        const carritoActualizado = await cartsService.updateCartWithProducts(carrito_id, nuevosProductos);
        res.status(200).json({ status: "success", message: "Carrito actualizado con nuevos productos", cart: carritoActualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const carrito_id = req.params.cid;
    const producto_id = req.params.pid;
    const nuevaCantidad = req.body.quantity;

    try {
        const carritoActualizado = await cartsService.updateProductQuantity(carrito_id, producto_id, nuevaCantidad);
        res.status(200).json({ status: "success", message: "Cantidad de producto actualizada en el carrito", cart: carritoActualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    const carrito_id = req.params.cid;

    try {
        const carritoActualizado = await cartsService.deleteAllProductsInCart(carrito_id);
        res.status(200).json({ status: "success", message: "Todos los productos del carrito fueron eliminados", cart: carritoActualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await cartsService.addCart(req.body);
        res.status(201).json({ status: "success", message: "Carrito agregado satisfactoriamente", cart: newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
