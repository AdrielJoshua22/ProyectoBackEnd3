export default class CartRepository
{
    constructor(dao)
    {
        this.dao = dao;
    }

    getCartWithDetails = (filter)=>
    {
        return this.dao.getCartWithDetails(filter);
    }

    getCartByUserId = (userId)=>
    {
        return this.dao.getCartByUserId(userId);
    }

    createCart = (user)=>
    {
        return this.dao.createCart(user);
    }

    getCartsByIdWithProducts =(carrito_id)=>
    {
        return this.dao.getCartsByIdWithProducts(carrito_id);
    }

    updateProductQuantity = (cartId, productId, quantity)=> 
    {
        return this.dao.updateProductQuantity(cartId, productId, quantity);
    }
}