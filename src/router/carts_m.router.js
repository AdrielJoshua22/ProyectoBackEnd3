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
router.post('/addProductToCart',validateJWT, authorization(['user']), passportCall('jwt', { session: false }), cartsController.updateCartProducts);

router.post('/:cid/purchase', validateJWT, authorization(['user']), passportCall('jwt', { session: false }), cartsController.purchaseCart);

router.delete('/:cid/products/:pid', async (req, res) => {
    const carrito_id = req.params.cid;
    const producto_id = req.params.pid;

    try {
        const carritoActualizado = await cartsService.removeProductFromCart(carrito_id, producto_id);
        req.logger.info(`[${new Date().toISOString()}] Producto eliminado del carrito.`);
        req.logger.debug(`[${new Date().toISOString()}] cart: ${carritoActualizado}`);
        res.status(200).json({ status: "success"});
    } catch (error) {
        req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
        res.status(500);
    }
});

router.put('/:cid', authorization(['user']), async (req, res) => {
    const carrito_id = req.params.cid;
    const nuevosProductos = req.body.products;

    try 
    {
        const carritoActualizado = await cartsService.updateCartWithProducts(carrito_id, nuevosProductos);
        req.logger.info(`[${new Date().toISOString()}] Carrito actualizado con nuevos productos.`);
        req.logger.debug(`[${new Date().toISOString()}] cart: ${carritoActualizado}`);
        res.status(200).json({ status: "success"});
    } catch (error) 
    {
        req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
        res.status(500);
    }
});

router.put('/:cid/products/:pid', authorization(['user']), async (req, res) => {
    const carrito_id = req.params.cid;
    const producto_id = req.params.pid;
    const nuevaCantidad = req.body.quantity;

    try 
    {
        const carritoActualizado = await cartsService.updateProductQuantity(carrito_id, producto_id, nuevaCantidad);
        req.logger.info(`[${new Date().toISOString()}] Cantidad de producto actualizada en el carrito.`);
        req.logger.debug(`[${new Date().toISOString()}] cart: ${carritoActualizado}`);
        res.status(200).json({ status: "success"});
    } catch (error) 
    {
        req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
        res.status(500);
    }
});

router.delete('/:cid', async (req, res) => {
    const carrito_id = req.params.cid;

    try 
    {
        const carritoActualizado = await cartsService.deleteAllProductsInCart(carrito_id);
        req.logger.info(`[${new Date().toISOString()}] Todos los productos del carrito fueron eliminados.`);
        req.logger.debug(`[${new Date().toISOString()}] cart: ${carritoActualizado}`);
        res.status(200).json({ status: "success" });
    } catch (error) 
    {
        req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
        res.status(500);
    }
});


export default router;