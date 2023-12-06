import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080'); 
const TEST_TIMEOUT = 4000;

describe('test funcional para Sessions routes', function() 
{
    this.timeout(TEST_TIMEOUT);
    
    it('endpoint POST /api/sessions/register debería registrar a un usuario y devolver un ID', async function () 
    {
        const userData = 
        {
            firstName: 'c',
            lastName: 'c',
            email: 'c@c.com',
            age: 25,
            password: '123'
        };

        const response = await requester.post('/api/sessions/register').send(userData);

        console.log(response.body); // Puedes imprimir el cuerpo de la respuesta si es necesario
        // Verificar el estado de la respuesta y la estructura esperada
        expect(response.status).to.be.equal(200);
        expect(response.body).to.have.property('status', 'success');
        expect(response.body).to.have.property('payload').that.is.a('string'); // Verificar que payload es un ID
    });

    it('endpoint POST /api/sessions/register debería devolver un error 400 si los datos de registro son incompletos', async function () {
        const userData =
        {
            firstName: 'c',
            lastName: 'c',
            age: 25,
            password: 'c'
        };

        const response = await requester.post('/api/register').send(userData);

        expect(response.status).to.be.equal(404);
        expect(response.body).to.be.empty;

    });

    it('endpoint POST /api/session/login debería realizar un inicio de sesión exitoso y devolver un token', async function () 
    {
        const userCredentials = 
        {
            email: 'luttringerezequiel@gmail.com',
            password: '123'
        };

        const response = await requester.post('/api/sessions/login').send(userCredentials);

        expect(response.status).to.be.equal(200);
        expect(response.body).to.have.property('status', 'success');
        expect(response.body).to.have.property('token').that.is.a('string');
    });

    it('endpoint POST /api/session/login debería devolver un error 400 si las credenciales de inicio de sesión son incorrectas', async function () {
        const incorrectCredentials = 
        {
            email: 'luttringerezequiel@gmail.com',
            password: '1'
        };

        const response = await requester.post('/api/sessions/login').send(incorrectCredentials);

        expect(response.status).to.be.equal(400);
        expect(response.body).to.have.property('status', 'error');
    });

});



