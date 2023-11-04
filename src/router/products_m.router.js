import { Router } from "express";
import ProductManager from "../dao/mongo/managers/productsDao.js";
import uploader from "../services/uploadServices.js";
import authorization from "../middlewares/authorization.js";
import productsController from "../controllers/products.controller.js";

const router = Router();
const productsService = new ProductManager();                                  

router.get('/', async(req, res)=>{                                                
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const sort = req.query.sort || 'asc';
    const category = req.query.category || null; // Capturar el parámetro "category"
    const status = req.query.status || null;     // Capturar el parámetro "status"

    // Construir un objeto de consulta en función de los parámetros proporcionados
    const queryObject = {};

    if (category) {
        queryObject.category = category; // Agregar filtro por categoría si se proporciona
    }

    if (status) {
        queryObject.status = status; // Agregar filtro por estado si se proporciona
    }

    const products = await productsService.getProductsPaginated(limit, page, queryObject, sort);

    res.send({status:"success", payload:products});                              //devuelvo todos los videojuegos
});

router.post('/', authorization('admin'), uploader.array('thumbnail'), productsController.addProduct);

router.put('/:pid', authorization('admin'), async(req, res)=>{   
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
    if(!product) return res.status(400).send({status:"error", error:"Producto incorrecto"});
    await productsService.updateProduct(pid, updateProduct);
    res.send({status:"success", message:"producto actualizado"});
});

router.delete('/:pid', authorization('admin'), async(req, res)=>{  
    const {pid} = req.params;
    const result = await productsService.deleteProduct(pid);
    res.send({status:"success", message:"Producto eliminado"});
});                      
                         
export default router;