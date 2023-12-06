import mongoose from 'mongoose';
import UserManager from '../../../src/dao/mongo/managers/userManager.js';
//import Assert from 'assert';
import {strict as assert} from 'assert';
import config from '../../../config.js';

const DB_URL = config.DB_URL;
const TEST_TIMEOUT = 15000;
//mongoose.connect(DB_URL, {useNewUrlParser: true,useUnifiedTopology: true});

describe('test unitario para DAO de Usuario', function()
{
    this.timeout(TEST_TIMEOUT);
    let idUser;

    before(async function () {await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })});
    //beforeEach(function(){mongoose.collections.users.drop()});  no quiero borrar todos mis usuarios
    after(async function () 
    {
        const users = new UserManager(); 
        const email = 'correoTest@gmail.com';
        const result = await users.deleteUserByEmail(email);

        await mongoose.disconnect()
    });

    it('[get] debe poder devolver a los usuarios en formato de arreglo', async function()
    {
        const users = new UserManager(); 
        const result = await users.get();
        assert.equal(Array.isArray(result), true);
    })

    it('[create] debe poder crear un usuario', async function()
    {
        const users = new UserManager(); 
        const newUser = 
        {
            firstName:'Christian',
            lastName:'Menendez',
            email:'correo@gmail.com',
            age:'23',
            password:'123123123',
            role: 'user'
        }

        const result = await users.create(newUser);
        assert.ok(result._id);
    })

    it('[create] no debe permitir crear usuarios con rol admin', async function()
    {
        const users = new UserManager(); 
        const newUser = 
        {
            firstName:'Christian',
            lastName:'Menendez',
            email:'correoTest@gmail.com',
            age:'23',
            password:'123123123',
            role: 'admin'
        }

        const result = await users.create(newUser);
        idUser = result._id;
        assert.equal(result.role, 'user');
    })


    it('[getBy] debe traer un usuario por un parametro dado', async function()
    {
        const users = new UserManager(); 
        const email = 'correo@gmail.com';

        const result = await users.getBy({email:email});
        assert.ok(result._id);
    })

    it('[detele] debe eliminar un usuario por email', async function()
    {
        const users = new UserManager(); 
        const email = 'correo@gmail.com';

        const result = await users.deleteUserByEmail(email);
        assert.ok(result);
    })

    it('[getByMongose] debe traer un usuario como instancia de mongoose', async function()
    {
        const users = new UserManager(); 
        const email = 'correoTest@gmail.com';

        const result = await users.getByMongose({email:email});
        assert.ok(result._id);
        assert.ok(result instanceof mongoose.Model, 'Instancia de Mongoose');
    })

    it('[getUserById] debe traer un usuario dado su id', async function()
    {
        const users = new UserManager(); 

        const result = await users.getUserById(idUser);
        assert.ok(result._id);
    })

    it('[changeUserRole] debe poder cambiar el rol de un usuario entre user y premium', async function()
    {
        const users = new UserManager(); 

        const result = await users.changeUserRole(idUser);
        assert.equal(result.role, 'premium');
    })

})



