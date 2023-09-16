import express from 'express';
import exphbs from 'express-handlebars';
import mongoose from 'mongoose';
import product_mRouter from './router/products_m.router.js';
import sessionRouter from './router/sessions.router.js';
import cart_mRouter from './router/carts_m.router.js';
import __dirname from './utils.js';
import views_mRouter from './router/views_m.router.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
//import FileStore from 'session-file-store';
import MongoStore from 'connect-mongo';



const app = express();
//const FileStorage = FileStore(session);      
const PORT = process.env.PORT||8080;
const server = app.listen(PORT, ()=>console.log(`esuchando en puerto ${PORT}`));
const connection = mongoose.connect("mongodb+srv://adrieljoshua:asd123@cluster0.cbzpqis.mongodb.net/?retryWrites=true&w=majority");
//const server = http.createServer(app); // Crea el servidor HTTP


//configuracion de handlebars
const hbs = exphbs.create();
hbs.allowProtoPropertiesByDefault = true;
app.engine('handlebars', hbs.engine); // Usa hbs.engine en lugar de handlebars.engine()
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

//middlewars
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static((`${__dirname}/public`)));
app.use(cookieParser("LECHUZA"));
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://adrieljoshua:asd123@cluster0.cbzpqis.mongodb.net/?retryWrites=true&w=majority",
        ttl:900
    }),                                            //new FileStorage({path: './sessions', retries:0, ttl:900,reapInterval:10}),
    secret: 'coderS3cret',
    resave: false,                   //reescribir session 
    saveUninitialized: true         //session solo donde se inicialice y utilicen
}))

//routes
app.use('/', views_mRouter);
app.use('/api/products', product_mRouter);
app.use('/api/carts', cart_mRouter);
app.use('/api/sessions', sessionRouter);

/*trabajo de cookies*/ 
/*
app.get('/home', (req,res)=>{
    res
    .cookie('galletaTriste',{name:"Chris:(",lastName:"Menendez:("},{maxAge:10000})
    .cookie('galletaFeliz', {name:"Chris", lastName:"Menendez"},{signed:true}).send({status:"success", payload:"usuario"});
})

app.get('/getCookies', (req,res)=>{
    console.log(req.cookies);
    res.send(`ok, cookies devueltas. <br><br>cookies: ${req.cookies?.galletaFeliz?.name}`);
})

app.get('/getSecretCookies', (req,res)=>{
    console.log(req.signedCookies);
    if(!req.signedCookies.galletaFeliz) return res.send("rechazado, cookies invalidas");
    res.send(`ok, cookies devueltas. <br><br>cookies: ${req.signedCookies?.galletaFeliz?.name}`);
})

app.get('/logout', (req,res)=>{
    res
    .clearCookie('galletaTriste')
    .clearCookie('galletaFeliz').send(`deslogeado`);
})
*/
/*trabajo de sessions*/ 
/*
app.get('/access', (req,res)=>
{
    if(!req.session.user)
    {
        res.send(`No te has logeado aun.`);
    }else 
    {
        res.send(`Bienvenido, ${req.session.user.firstName}`); 
    }
})

app.get('/login', (req,res)=>
{
    const user = {firstName:"Christian", lastName:"Menendez"};
    req.session.user = user;
    res.send("listo login");
})

app.get('/profile', (req,res)=>
{
    res.send({usuario: req.session.user});
})

app.get('/sessionLogout', (req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.status(500).send("fallo el logout")
        res.send('adios');
    })
})
*/