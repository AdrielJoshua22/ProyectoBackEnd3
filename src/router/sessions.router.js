import { Router } from "express";
import UserManager from "../dao/mongo/managers/userManager.js";

const router = Router();
const usersServices = new UserManager();

router.post('/register', async(req,res)=>{
    const {firstName, lastName, email, age, password} = req.body;
    if (!firstName || !lastName || !email || !age || !password) return res.status(400).send({status: "error", error: "incomplete values"})
    
    const newUser = {firstName, lastName, email, age, password};
    const result = await usersServices.create(newUser);
    res.status(200).send({status:"success", message:"registrado correctamente"});
})

router.post('/login', async(req,res)=>{
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).send({status: "error", error: "incomplete values"})
    
    const user = await usersServices.getBy({email, password});
    if(!user) return res.status(400).send({status: "error", error: "incorrect credentials"});
    req.session.user = user;
    res.status(200).send({status:"success", message:"logeado"});
})

router.get('/logout', async(req,res)=>{
    req.session.destroy(error=>{
        if(error) 
        {
            console.log(error); 
        }
        return res.redirect('/');
    });
    
})

export default router;