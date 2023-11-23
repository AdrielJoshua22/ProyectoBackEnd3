import { Router } from "express";
import ProductManager from "../dao/mongo/managers/productsDao.js";
import uploader from "../services/uploadServices.js";
import authorization from "../middlewares/authorization.js";
import productsController from "../controllers/products.controller.js";
import { generateProducts } from "../mocks/products.js";

const router = Router();
const productsService = new ProductManager();                                  

router.get('/', async(req, res)=>{                                                
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const sort = req.query.sort || 'asc';
    const category = req.query.category || null; // Capturar el parámetro "category"
    const status = req.query.status || null;     // Capturar el parámetro "status"

    if (category) queryObject.category = category;
    if (status) queryObject.status = status; 
    
    const products = await productsService.getProductsPaginated(limit, page, queryObject, sort);

    res.send({status:"success", payload:products});
});

router.post('/', authorization(['admin','premium']), uploader.array('thumbnail'), productsController.addProduct);

router.put('/:pid', authorization(['admin']), async(req, res)=>{   
    const {pid} = req.params;
    const { title, description, category, code, status, price, stock} = req.body;
    
    const updateProduct= {
        title,
        description,
        category,
        code,
        status,
        price,
        stock
    }
    
    const product = await productsService.getProductsBy({_id:pid});
    if(!product)
    {
        req.logger.warning(`[${new Date().toISOString()}] Alerta: Se intento agregar un producto con formato incorrecto`);
        return res.status(400);
    };
    await productsService.updateProduct(pid, updateProduct);
    req.logger.info(`[${new Date().toISOString()}] Producto actualizado con exito`);
    req.logger.debug(`[${new Date().toISOString()}] Producto actualizado: ${updateProduct}`);
    res.send({status:"success"});
});

router.delete('/:pid', authorization(['admin']), async(req, res)=>{  
    const {pid} = req.params;
    const result = await productsService.deleteProduct(pid);
    req.logger.info(`[${new Date().toISOString()}] Poducto eliminado con exito`);
    res.send({status:"success"});
});      

router.get('/mockingproducts', async(req,res)=>
{
    const products = [];

    for(let i=0;i<100;i++)
    {
        const mockProduct = generateProducts();
        products.unshift(mockProduct);
    }

    res.send({status:'success', payload:products});
});
                         
export default router;