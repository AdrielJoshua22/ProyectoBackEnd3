import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";
import passportCall from "../middlewares/passportCall.js";
import { validateJWT } from "../middlewares/jwtExtractor.js";

import CartsManager from "../dao/mongo/managers/cartsDao.js";
import authorization from "../middlewares/authorization.js";

const router = Router();
const cartsService = new CartsManager(); 

router.get('/:cid', passportCall('jwt', { session: false }), cartsController.getCart);
router.post('/', passportCall('jwt', { session: false }), cartsController.createCartByUserId);
router.post('/addProductToCart',validateJWT, authorization('user'), passportCall('jwt', { session: false }), cartsController.updateCartProducts);

router.post('/:cid/purchase', validateJWT, authorization('user'), passportCall('jwt', { session: false }), cartsController.purchaseCart);

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

router.put('/:cid', authorization('user'), async (req, res) => {
    const carrito_id = req.params.cid;
    const nuevosProductos = req.body.products;

    try {
        const carritoActualizado = await cartsService.updateCartWithProducts(carrito_id, nuevosProductos);
        res.status(200).json({ status: "success", message: "Carrito actualizado con nuevos productos", cart: carritoActualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:cid/products/:pid', authorization('user'), async (req, res) => {
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


export default router;