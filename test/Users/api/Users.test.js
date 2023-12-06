import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080'); 
const TEST_TIMEOUT = 15000;

describe('test funcional para Users routes', function () 
{
    this.timeout(TEST_TIMEOUT);
    
    it('endpoint GET /api/users/resetPass/:email debe recibir por param email del usuario a reiniciar pass y devolver status 200 con msj: Correo de restablecimiento enviado con éxito', async function () 
    {
        const emailUsr = 'luttringerezequiel@gmail.com';
        const response = await requester.get(`/api/users/resetPass/${emailUsr}`);

        expect(response.status).to.be.equal(200);
        expect(response.body.message).to.equal('Correo de restablecimiento enviado con éxito');
    });

    it('endpoint GET /api/users/resetPass/:email debe devolver 404 si no se encuentra usuario por email pasado', async function () 
    {
        const emailUsr = ' ';
        const response = await requester.get(`/api/users/resetPass/${emailUsr}`);
    
        expect(response.status).to.be.equal(404);
    });
});

