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
}