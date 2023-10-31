import cartsModel from "../models/carts.js";

export default class CartsDao 
{

    getCartByUserId = async (userId) => 
    {
        try 
        {
            const cart = await cartsModel.findOne({ 'user': userId }).populate('user');
            return cart;
        } catch (error) 
        {
            throw error;
        }
    }

    createCart = async (cart) => 
    {
        try {
            const newCart = new cartsModel(cart);
            const savedCart = await newCart.save();
            return savedCart;
        } catch (error) {
            throw error;
        }
    }


    updateProductQuantity = async (cartId, productId, quantity) => 
    {
        try 
        {
            const cart = await cartsModel.findById(cartId);
            if (!cart) throw new Error(`No se encontró el carrito con ID ${cartId}`);
            const productToUpdate = cart.products.find((product) =>product.id_product.toString() === productId);
            if (!productToUpdate) cart.products.push({ id_product: productId, quantity });
            else productToUpdate.quantity += quantity;  
            await cart.save();
    
            return cart;
        } catch (error) {throw error;}
    }

    removeProductFromCart = async (cartId, productId) => 
    {
        try 
        {
            const cart = await cartsModel.findById(cartId);

            if (!cart) throw new Error(`No se encontró el carrito con ID ${cartId}`);
            
            cart.products = cart.products.filter((product) =>
                product.id_product.toString() !== productId
            );

            await cart.save();

            return cart;
        } catch (error) 
        {
            throw error;
        }
    }

    getCartWithDetails = async (cartId) => 
    {
        try 
        {
            const cart = await cartsModel.findById(cartId).populate({
                path: "products.id_product",
                model: "products"
            });

            if (!cart) throw new Error(`No se encontró el carrito con ID ${cartId}`);
        
            return cart;
        } catch (error) 
        {
            throw error;
        }
    }

    updateCartWithProducts = async (cartId, newProducts) => 
    {
        try 
        {
            const existingCart = await cartsModel.findById(cartId);
            if (!existingCart) throw new Error(`No se encontró el carrito con ID ${cartId}`);
            

            existingCart.products = newProducts;
    
            const updatedCart = await existingCart.save();
    
            return updatedCart;
        } catch (error) 
        {
            throw error;
        }
    }

    deleteAllProductsInCart = async (cartId) => 
    {
        try 
        {
            const existingCart = await cartsModel.findById(cartId);
            if (!existingCart) throw new Error(`No se encontró el carrito con ID ${cartId}`);
            
        
            existingCart.products = [];
    
            const updatedCart = await existingCart.save();
    
            return updatedCart;
        } catch (error) 
        {
            throw error;
        }
    }

    getCartsByIdWithProducts = async (cartId) => 
    {
        try 
        {
            // Encuentra el carrito por su ID y carga los productos asociados
            const cartWithProducts = await cartsModel.findById(cartId)
                .populate('products.id_product', 'title price'); // 'id_product' se refiere al campo en productSchema
    
            if (!cartWithProducts) throw new Error(`No se encontró el carrito con ID ${cartId}`);
            
            return cartWithProducts;
        } catch (error) 
        {
            throw error;
        }
    }
}