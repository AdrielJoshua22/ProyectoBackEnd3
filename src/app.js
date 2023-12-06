import config from '../config.js';
import express from 'express';
import exphbs from 'express-handlebars';
import mongoose from 'mongoose';
import product_mRouter from './router/products_m.router.js';
import sessionRouter from './router/sessions.router.js';
import cart_mRouter from './router/carts_m.router.js';
import __dirname from './utils.js';
import views_mRouter from './router/views_m.router.js';
import cookieParser from 'cookie-parser';
//import session from 'express-session';
//import FileStore from 'session-file-store';
//import MongoStore from 'connect-mongo';
//import passport from 'passport';
import initializeStrategies from './config/passport.config.js';
import dictionaryRouter from './router/dictionary.router.js';
import usersRouter from './router/users.router.js';

import cors from 'cors';
import twilio from 'twilio';
import errorHandler from './middlewares/errorHandler.js';
import attachLogger from './middlewares/attachLogger.js';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';

import cluster from 'cluster';
import os from 'os';


if(cluster.isPrimary) 
{
    const performance_set = 50; //esta es una idea que se me ocurrio para poder establecer el nivel de rendimiento a exigir para la maquina
    const cpus = Math.floor(os.cpus().length * (performance_set * 0.01));

    for(let i=0; i<cpus;i++)
    {
        cluster.fork();
        cluster.on('exit', worker=>
        {
            console.log(`el worker con pid ${worker.process.pid} cayó.`);
            cluster.fork();
        })
    }
}else 
{
    //variables de entorno del .env
    const DB_URL = config.DB_URL;
    const ENVPORT =  config.PORT;
    const COOKIEPARSER =   config.COOKIEPARSER;

    //configuracion de swagger
    const swaggerSpecOptions = 
    {
        definition:
        {
            openapi:'3.0.1',
            info: 
            {
                title: 'e-commerce wine uruguay',
                description: 'e-commerce en base a una tienda online de vinos.'
            }
        },
        apis: [`${__dirname}/docs/**/*.yml`]
    }

    const swaggerSpec = swaggerJSDoc(swaggerSpecOptions);
    

    //twilio config init
    const twilioClient = twilio(config.TWILIO_SID, config.TWILIO_AUTH_TOKEN);
    const app = express();


    //const FileStorage = FileStore(session);      
    const PORT = ENVPORT || 8080;
    const server = app.listen(PORT, ()=>console.log(`escuchando en puerto ${PORT}`));
    try 
    {
        const connection = await mongoose.connect(DB_URL, {useNewUrlParser: true,useUnifiedTopology: true});
        console.log(`Conexión a la base de datos exitosa`);
    } catch (error) {console.log(`[${new Date().toLocaleDateString()}] Error de conexión a la base de datos: ${error}`)}


    //configuracion de handlebars (se agrega funcion de hbs para calcular precio total en carrito)
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


    app.engine('handlebars', hbs.engine); 
    app.set('view engine', 'handlebars');
    app.set('views', `${__dirname}/views`);



    //middlewars
    app.use(attachLogger);
    app.use(cors({origin:['http://localhost:8080'],credentials:true}));
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(express.static((`${__dirname}/public`)));
    app.use(cookieParser(COOKIEPARSER));
    app.use(errorHandler);
    



    //configuracion de passport, ejecucion
    initializeStrategies();

    //routes
    app.use('/', views_mRouter);
    app.use('/api/products', product_mRouter);
    app.use('/api/carts', cart_mRouter);
    app.use('/api/sessions', sessionRouter);
    app.use('/api/dictionary', dictionaryRouter);
    app.use('/api/users', usersRouter);
    app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerSpec));
    

    //sms example 
    app.get('/twilio', async (req,res)=>
    {
        const result = await twilioClient.messages.create(
        {
            from: config.TWILIO_TEST_NUMBER,
            to:'+59892181416',
            body:'hola chris'
        })
        console.log(result);
        res.sendStatus(200);
    })

    //logger endpoint 
    app.get('/loggerTest', attachLogger, async(req,res)=>
    {
        logger.log('debug', "prueba logger");
        logger.log('http', "prueba logger");
        logger.log('info', "prueba logger");
        logger.log('error', "prueba logger");
        logger.log('fatal', "prueba logger");
        res.sendStatus(200);
    })
}
