import { productService } from "../services/index.js";
import { cartService } from "../services/index.js";

const getViewsProducts = async (req, res) => 
{
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const sort = req.query.sort || 'asc';
    const category = req.query.category || null; 
    const status = req.query.status || null;     

    const queryObject = {};

    if (category) queryObject.category = category;
    if (status) queryObject.status = status; 

    try {
        const products = await productService.getViewsProducts(limit, page, queryObject, sort);

        res.render('Products', 
        {
            user: user,
            filterProducts: products.filterProducts,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            totalPages: products.totalPages
        });
    } catch (error) 
    {
        // Manejo de errores, puedes enviar una respuesta de error o registrar el error
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};

const getCartsById = async (req, res) => 
{
    const carrito_id = req.params.cid;
    const filter = { _id: carrito_id };
    const cart = await cartService.getCartWithDetails(filter);

    //creo un cart con las propiedades por defecto cambiadas ya que hbs no le gusta manejarlas directamente
    let productos = [];
    if (cart) productos = cart.products;
    
    const cart_filtrado = 
    {
        id: cart ? cart._id : null, 
        productos,
    };

    res.render('Carts', { cart_filtrado });
};

export default 
{
    getViewsProducts,
    getCartsById
}