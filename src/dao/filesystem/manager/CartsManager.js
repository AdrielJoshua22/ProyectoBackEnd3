import fs from 'fs';
import __dirname from '../utils.js';
import path from 'path';

export default class CartsManager 
{
    
    constructor(filePath) 
    {
        const newPath = path.join(__dirname, 'files', filePath);
        this.path = newPath;
    }

    getCarts = async ()=>
    {
        try 
        {
            if(fs.existsSync(this.path))
            {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                console.log(`se encontro un archivo .json con la ruta: ${this.path}, se cargaran sus datos...`);
                const carts = JSON.parse(data);
                return carts;
            }else 
            {
                console.log(`se creo un archivo .json en la ruta:${this.path} para almacenar datos.`)
                return [];
            }
            
        } catch (error) 
        {
            console.log(error);
        }
    }

    addCarts = async ()=>
    {
        try 
        {
            
            const carritos = await this.getCarts();
            let carrito = 
            {
                "id": carritos.length+1,
                "products": []
            };
            carritos.push(carrito);

            await fs.promises.writeFile(this.path, JSON.stringify(carritos, null, '\t'));
            return carrito;

        }catch(error)
        {
            console.log(error);
        }
    }

    getCartById = async(idCarrito)=> 
    {
        try 
        {
            const carritos = await this.getCarts();
            const carritoIndex = carritos.findIndex(c=> c.id == idCarrito);

            if(carritoIndex === -1)
            {
                console.log(`en base al id proporcionado:${idCarrito}, no se encontro carrito alguno.`);
                return;
            }else 
            {
                console.log(`encontramos un carrito con el id proporcionado (${idCarrito}) sus datos son:`);
                return carritos[carritoIndex].products;
            }

        }catch(error)
        {
            console.log(error);
        }
    }

    addProductToCart = async (idCarrito, idProducto) => {
        try {
            const carritos = await this.getCarts();
            const carritoIndex = carritos.findIndex(c => c.id == idCarrito);
    
            if (carritoIndex === -1) {
                console.log(`En base al id proporcionado: ${idCarrito}, no se encontró ningún carrito.`);
                return;
            } else {
                let carrito_n = carritos[carritoIndex];
                const carritoProductoIndex = carrito_n.products.findIndex(c => c.id == idProducto);
    
                if (carritoProductoIndex === -1) {
                    console.log(`En carrito de id: ${idCarrito}, no se encontró ningún producto con id: ${idProducto}. Se agregará.`);
    
                    let newProductoToCarrito = {
                        "id": idProducto,
                        "quantity": 1
                    };
    
                    carrito_n.products.push(newProductoToCarrito);
    
                    await fs.promises.writeFile(this.path, JSON.stringify(carritos, null, '\t'));
                    return;
                } else {
                    console.log(`En carrito de id: ${idCarrito}, se encontró un producto con id: ${idProducto}. Se le sumará +1 a su cantidad.`);
                    carrito_n.products[carritoProductoIndex].quantity += 1;
    
                    await fs.promises.writeFile(this.path, JSON.stringify(carritos, null, '\t'));
                    return; 
                }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
