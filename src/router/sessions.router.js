import { Router } from "express";
import passport from "passport";
import auth from "../services/auth.js";
import UserManager from "../dao/mongo/managers/userManager.js";
import jwt from "jsonwebtoken";
import { validateJWT } from "../middlewares/jwtExtractor.js";
import passportCall from "../middlewares/passportCall.js";
import authorization from "../middlewares/authorization.js";

const usersServices = new UserManager();
const router = Router();

router.post('/register',passportCall('jwt'), async(req,res)=>
{
    res.status(200).send({status:"success", payload:req.user._id});
})

/*
router.post('/login',passportCall('jwt'), async(req,res)=>
{
    req.session.user = req.user;
    res.status(200).send({status:"success", message:"logeado"});
});*/ 

router.post('/loginJWT',passportCall('jwt'), async(req,res)=>
{
    //login logic
    const {email,password} = req.body;

    if(!email || !password) return res.status(400).send({status:'error', error:'Incomplete values'})
    const user = await usersServices.getBy({email});
    if(!user) return res.status(400).send({status:'error', error:'Incorrect credentials'})
    const isValidPassword = await auth.validatePassword(password, user.password);
    if(!isValidPassword) return res.status(400).send({status:'error', error:'Incorrect credentials'})
    
    //token JWT
    const token = jwt.sign({id:user._id, email:user.email, role:user.role, name:user.firstName}, 'buhoS3cr3t', {expiresIn:'1d'});
    //cookie y success status
    res.cookie('authCookie',token,{httpOnly:true}).send({status:'success', token});

})

router.get('/profileInfo',validateJWT, async(req,res)=>
{
    console.log(req.user);
    res.send({status:'success', payload:req.user})
})


//autenticacion de terceros 

router.get('/github', passport.authenticate('github'),(req,res)=>{})
router.get('/githubcallback',passport.authenticate('github'),(req,res)=>
{
    req.session.user = req.user;
    res.redirect('/');
})

router.get('/current', passportCall('jwt'),authorization('admin'),(req,res)=>
{
    const user = req.user;
    res.send({status:"success", payload:user});
})

router.get('/authFail', (req,res)=>
{
    //console.log(req.session.message);
    res.status(401).send({status:"error", error:"Error de autenticación"});
})

router.get('/logout', async(req,res)=>
{
    req.session.destroy(error=>
    {
        if(error) console.log(error); 
        return res.redirect('/');
    });
})

export default router;