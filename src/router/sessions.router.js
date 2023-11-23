import { Router } from "express";
import passport from "passport";
//import auth from "../services/auth.js";
//import UserManager from "../dao/mongo/managers/userManager.js";
import jwt from "jsonwebtoken";
import { validateJWT } from "../middlewares/jwtExtractor.js";
import passportCall from "../middlewares/passportCall.js";
import authorization from "../middlewares/authorization.js";
//import executePolicies from "../middlewares/executePolicies.js";
//import userController from "../controllers/user.controller.js";

//const usersServices = new UserManager();
const router = Router();


router.post('/register', async(req,res)=>
{
    //utilizo mi passport strategy para register.
    passport.authenticate('register', (error, result, info) => 
    {
        if (error)
        {
            req.logger.error(`[${new Date().toISOString()}] Error: Internal server error`);
            return res.status(500);
        } 
        
        if (!result)
        {
            req.logger.error(`[${new Date().toISOString()}] Error: ${info.message ? info.message : info.toString()}`);
            return res.status(400);
        } 

        req.logger.info(`[${new Date().toISOString()}] Registro llevado a cabo con exito`);
        req.logger.debug(`[${new Date().toISOString()}] Registro exitoso, id: ${result._id}`);
        res.status(200).send({ status: "success", payload: result._id });
    })(req, res);
})

router.post('/login', (req, res) => {
    passport.authenticate('login', (error, user, info) => 
    {
        if (error)
        {
            req.logger.error(`[${new Date().toISOString()}] Error: Internal server error`);
            return res.status(500);
        } 
        if (!user)
        {
            req.logger.error(`[${new Date().toISOString()}] Error: ${info.message ? info.message : info.toString()}`);
            return res.status(400).send({ status: "error"});
        }

        //configuracion de token JWT y cookie asociada
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.firstName }, 'buhoS3cr3t', { expiresIn: '1d' });
        res.cookie('authCookie', token, { httpOnly: true }).send({ status: 'success', token });
        req.logger.info(`[${new Date().toISOString()}] Login exitoso`);
    })(req, res);
});

router.get('/current', passportCall('jwt'), authorization(['user']),(req,res)=>
{
    const user = req.user;

    const userDTO = 
    {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    res.send({ status: "success", payload: userDTO });
})

router.get('/profileInfo',validateJWT, async(req,res)=> 
{
    res.send({status:'success', payload:req.user})
})

router.get('/logout', async(req,res)=>
{
    //elimino jwt token y redirecciono.
    req.logger.info(`[${new Date().toISOString()}] Logout exitoso`);
    res.clearCookie('authCookie'); 
    res.redirect('/');
})



//autenticacion de terceros con passport
//github
router.get('/github', passportCall('github'),(req,res)=>{})
router.get('/githubcallback',validateJWT, passportCall('github'),(req,res)=>
{
    req.logger.info(`[${new Date().toISOString()}] Login exitoso por github`);
    const user = req.user;
    res.redirect('/');
})

router.get('/google', passportCall('google', { scope: ['profile', 'email'] }));
router.get('/googlecallback', passportCall('google', { failureRedirect: '/login' }), (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.firstName }, 'buhoS3cr3t', { expiresIn: '1d' });
    res.cookie('authCookie', token, { httpOnly: true });
    res.render('products', { authToken: token });
    req.logger.info(`[${new Date().toISOString()}] Login exitoso por google`);
 });

router.get('/authFail', (req,res)=>
{
    req.logger.error(`[${new Date().toISOString()}] Error: Hubo un fallo en la autenticacion del usuario`);
    res.status(401).send({status:"error"});
})


export default router;