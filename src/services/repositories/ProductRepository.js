export default class ProductRepository
{
    constructor(dao)
    {
        this.dao = dao;
    }

    getViewsProducts = (limit, page, queryObject, sort)=>
    {
        return this.dao.getViewsProducts(limit, page, queryObject, sort);
    }

    addProduct = (newProduct)=>
    {
        return this.dao.addProduct(newProduct);
    }

    getProductById = (id)=> 
    {
        return this.dao.getProductById(id);
    }

    updateProduct = (id, product)=>
    {
        return this.dao.updateProduct(id, product);
    }

}