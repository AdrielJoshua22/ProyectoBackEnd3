import { cartService, productService, ticketService, userService } from "../services/index.js";

const createCartByUserId = async (req, res) => 
{
    try {
        const userId = req.user.id;
        const existingCart = await cartService.getCartByUserId(userId);

        if (existingCart) 
        {
            res.redirect(`/api/carts/${existingCart._id}`);
        } else {
            const newCart = await cartService.createCart({ user: userId });
            res.redirect(`/api/carts/${newCart._id}`);
        }
    } catch (error) 
    {
        req.logger.error(`[${new Date().toISOString()}] Error: ${error.message }`);
        res.status(500);
    }
};

const getCart = async (req, res) => {
    const carrito_id = req.params.cid;

    try {
        const carritoObjeto = await cartService.getCartsByIdWithProducts(carrito_id);

        if (carritoObjeto) {
            let productos = [];
            if (carritoObjeto) productos = carritoObjeto.products;

            const cart_filtrado = 
            {
                id: carritoObjeto ? carritoObjeto._id : null,
                usuario: carritoObjeto ? carritoObjeto.user : null,
                productos: productos.map(product => ({
                    f_title: product.id_product.title,
                    f_description: product.id_product.description,
                    f_category: product.id_product.category,
                    f_code: product.id_product.code,
                    f_status: product.id_product.status,
                    f_stock: product.id_product.stock,
                    f_price: product.id_product.price,
                    f_quantity: product.quantity
                }))
            };

            req.logger.info(`[${new Date().toISOString()}] Carrito obtenido con exito`);
            req.logger.debug(`[${new Date().toISOString()}] Carrito: ${cart_filtrado}`);
            res.render('Carts', { cart_filtrado });
        } else 
        {
            req.logger.warning(`[${new Date().toISOString()}] Alerta: Carrito no existe`);
            res.status(400);
        }
    } catch (error) 
    {
        req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
        res.status(500);
    }
}

const updateCartProducts = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.body.productId;
        const product = await productService.getProductById(productId);
        const user = await userService.getUserById(userId);
        
        if(user.role === "premium" && product.owner === user.email) res.status(400).send("no puedes agregar este producto porque eres dueño de el");
        
        let cart = await cartService.getCartByUserId(userId);
        if (!cart) 
        {
            cart = await cartService.createCart({ user: userId, products: [{ id_product: productId, quantity: 1 }] });
            req.logger.info(`[${new Date().toISOString()}] No existe el carrito, se crea uno nuevo`);
            req.logger.debug(`[${new Date().toISOString()}] Carrito nuevo: ${cart}`);
        } else 
        {
            const updateCart = await cartService.updateProductQuantity(cart._id, productId, 1);
            req.logger.info(`[${new Date().toISOString()}] Carrito actualizado`);
            req.logger.debug(`[${new Date().toISOString()}] Carrito actualizado: ${updateCart}`);
        }

        res.status(200).send("Producto actualizado en el carrito");

    } catch (error) {
        req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
        res.status(500);
    }
}

const purchaseCart = async (req, res) => 
{
    try {
        const userId = req.user.id;
        const cartId = req.params.cid;
        const sumProducts = req.body.sumTotalPrice;
        const cart = await cartService.getCartByUserId(userId);


        if (!cart)
        {
            req.logger.warning(`[${new Date().toISOString()}] Alerta: Carrito no encontrado`);
            return res.status(404);
        }

        // Verifica el stock de cada producto en el carrito
        const productsInCart = cart.products;
        const purchasedProducts = []; // Almacenará los productos comprados

        for (const productInCart of productsInCart) 
        {
            const productId = productInCart.id_product;
            const product = await productService.getProductById(productId);

            if (!product) 
            {
                req.logger.warning(`[${new Date().toISOString()}] Alerta: Producto no encontrado`);
                return res.status(404);
            }

            if (product.stock >= productInCart.quantity) purchasedProducts.push(productInCart);
            
            product.stock -= productInCart.quantity;
            const updateProduct = await productService.updateProduct(productId,product);
            req.logger.debug(`[${new Date().toISOString()}] Producto actualizado: ${updateProduct}`);
        }

        // Actualiza el carrito con los productos que no se compraron
        const updatedProducts = productsInCart.filter(productInCart => !purchasedProducts.includes(productInCart));
        cart.products = updatedProducts;
        await cart.save();
        
        const ticket = await ticketService.createTicket(userId, cartId, sumProducts);
        req.logger.info(`[${new Date().toISOString()}] Compra Exitosa`);
        req.logger.debug(`[${new Date().toISOString()}] Ticket compra: ${ticket}`);

        return res.status(200).send({ status: 200});
    } catch (error) 
    {
        req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
        return res.status(500);
    }
}

export default 
{
    createCartByUserId,
    getCart,
    updateCartProducts,
    purchaseCart
}