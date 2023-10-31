import { productService } from "../services/index.js";

const addProduct = async (req, res) => 
{
    const { title, description, category, code, status, price, stock} = req.body;
    if(!title || !description || !category || !code || !status || !price || !stock) return res.status(400).send({status:"error",error:"producto incompleto"});
    const newProduct = {title,description,category,code,status,price,stock}
    const thumbnail = req.files.map(file=>`${req.protocol}://${req.hostname}:${process.env.PORT||8080}/img/${file.filename}`)
    newProduct.thumbnail = thumbnail;

    const result = await productService.addProduct(newProduct);
    res.send({status:"success", payload:result._id});
};

export default 
{
    addProduct,
}