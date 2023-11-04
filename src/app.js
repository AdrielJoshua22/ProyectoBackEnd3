//configuracion para utilizar .env
import dotenv from 'dotenv';
dotenv.config();

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
import passport from 'passport';
import initializeStrategies from './config/passport.config.js';
import dictionaryRouter from './router/dictionary.router.js';
import cors from 'cors';
import nodemailer from 'nodemailer';

//variables de entorno del .env
const DB_URL = process.env.DB_URL;
const ENVPORT = process.env.PORT;
const COOKIEPARSER =  process.env.COOKIEPARSER;
const GMAIL_USER =  process.env.GMAIL_USER;
const GMAIL_PASS=  process.env.GMAIL_PASS;

const app = express();
//const FileStorage = FileStore(session);      
const PORT = ENVPORT || 8080;
const server = app.listen(PORT, ()=>console.log(`esuchando en puerto ${PORT}`));
try 
{
    const connection = await mongoose.connect(DB_URL, {useNewUrlParser: true,useUnifiedTopology: true});
    console.log('Conexión a la base de datos exitosa');
} catch (error) {console.error('Error de conexión a la base de datos:', error);}


//configuracion de handlebars
const hbs = exphbs.create({
    helpers: 
    {
        sumPrice: function (products) 
        {
            let total = 0;
            for (const product of products) {
                total += product.f_price * product.f_quantity;
            }
            return total;
        }
    }
});

hbs.allowProtoPropertiesByDefault = true;


app.engine('handlebars', hbs.engine); // Usa hbs.engine en lugar de handlebars.engine()
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);



//middlewars'
app.use(cors({origin:['http://localhost:8080'],credentials:true}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static((`${__dirname}/public`)));
app.use(cookieParser(COOKIEPARSER));


//configuracion de passport, ejecucion
initializeStrategies();

//routes
app.use('/', views_mRouter);
app.use('/api/products', product_mRouter);
app.use('/api/carts', cart_mRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/dictionary', dictionaryRouter);


app.get('/mails', async(req,res)=>
{
    const transport = nodemailer.createTransport(
    {
        service:'gmail',
        port:587,
        auth:
        {
            user: GMAIL_USER,
            pass: GMAIL_PASS
        }
    })

    const mailRequest = 
    {
        from: 'yo mismo',
        to:['joshuaamengual9305@gmail.com'],
        subject: 'hola, adquiera el servicio',
        html:
        `
            <h1>mapaches</h1>
            <img src="cid:mapache">
        `,
        attachments:
        [
            {
                filename: 'mapache.webp',
                path: './src/public/img/others/mapache.webp'
            },
            {
                filename: 'mapache.webp',
                path: './src/public/img/others/mapache.webp',
                cid:'mapache'
            }
        ]
    }

    const mailResult = await transport.sendMail(mailRequest);
    console.log(mailResult);
    res.sendStatus(200);
})