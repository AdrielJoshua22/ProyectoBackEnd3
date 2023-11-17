import { productService } from "../services/index.js";

const addProduct = async (req, res) => 
{
    const { title, description, category, code, status, price, stock} = req.body;
    if(!title || !description || !category || !code || !status || !price || !stock)
    {
        req.logger.warning(`[${new Date().toISOString()}] Alerta: producto incompleto}`);
        return res.status(400).send({status:"error"});
    } 
    const newProduct = {title,description,category,code,status,price,stock}
    const thumbnail = req.files.map(file=>`${req.protocol}://${req.hostname}:${process.env.PORT||8080}/img/${file.filename}`)
    newProduct.thumbnail = thumbnail;

    const result = await productService.addProduct(newProduct);
    req.logger.info(`[${new Date().toISOString()}] Producto agregado con exito`);
    req.logger.debug(`[${new Date().toISOString()}] Producto: ${newProduct}`);
    res.send({status:"success", payload:result._id});
};

export default 
{
    addProduct,
}