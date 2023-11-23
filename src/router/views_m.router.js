import { Router } from "express";
//import ProductManager from "../dao/mongo/managers/productsManager.js";
//import CartsManager from "../dao/mongo/managers/cartsManager.js";
import passportCall from "../middlewares/passportCall.js";

//controladores
import viewsController from "../controllers/views.controller.js";

const router = Router();

//const productsService = new ProductManager();   

router.get('/products', passportCall('jwt', { session: false }), viewsController.getViewsProducts);

router.get('/carts/:cid', viewsController.getCartsById);

router.get('/', passportCall('jwt'), (req, res) => 
{
    const user = req.user; 
    if (!req.cookies.authCookie || !req.user)  return res.redirect('/login');
    
    res.render('profile', { user });          
});

router.get('/register', async(req,res)=>{
    res.render('register')
})

router.get('/login', async(req,res)=>{
    res.render('login')
})

router.get('/profilejwt',passportCall('jwt'), async(req,res)=>{
    res.render('ProfileJWT', {user: req.user});
})

router.get('/restartPass',passportCall('jwt'), async(req,res)=>{
    res.render('restartPass', {user: req.user});
})


export default router;