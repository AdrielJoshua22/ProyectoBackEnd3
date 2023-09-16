import fs from 'fs';
import __dirname from '../../../utils.js';
import path from 'path';

export default class ProductManager 
{
    
    constructor(filePath) 
    {
        const newPath = path.join(__dirname, 'files', filePath);
        this.path = newPath;
    }

    getProducts = async ()=>
    {
        try 
        {
            if(fs.existsSync(this.path))
            {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                console.log(`se encontro un archivo .json con la ruta: ${this.path}, se cargaran sus datos...`);
                const productos = JSON.parse(data);
                return productos;
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

    addProduct = async(producto)=> 
    {
        try 
        {
            if (!producto.title || !producto.descripcion || !producto.price || !producto.code || !producto.stock || !producto.category) {
                throw new Error("Todos los campos, excepto 'thumbnail', son obligatorios.");
            }
            
            const productos = await this.getProducts();
            producto.id = productos.length+1;
            producto.status=true;
            productos.push(producto);

            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'));
            return producto;

        }catch(error)
        {
            console.log(error);
        }
    }

    getProductById = async(idProducto)=> 
    {
        try 
        {
            const productos = await this.getProducts();
            const productoIndex = productos.findIndex(u=> u.id == idProducto);

            if(productoIndex === -1)
            {
                console.log(`en base al id proporcionado:${idProducto}, no se encontro producto alguno.`);
                return;
            }else 
            {
                console.log(`encontramos un producto con el id proporcionado (${idProducto}) sus datos son:`);
                return productos[productoIndex];
            }

        }catch(error)
        {
            console.log(error);
        }
    }

    updateProduct = async(newProducto,id_producto)=> 
    {
        try 
        {
            const productos = await this.getProducts();
            const productoIndex = productos.findIndex(u=> u.id == id_producto);

            if(productoIndex === -1)
            {
                console.log(`en base al id proporcionado:${id_producto}, no se encontro producto alguno a actualizar.`);
                return;
            } 
            
            console.log(`encontramos un producto con el id proporcionado (${id_producto}), lo actualizaremos.`);
            newProducto.id = id_producto;
            productos[productoIndex] = newProducto;
            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'));
            return;
            
        }catch(error)
        {
            console.log(error);
        }
    }

    deleteProduct = async(idProducto)=> 
    {
        try 
        {
            const productos = await this.getProducts();
            const productoIndex = productos.findIndex(u=> u.id == idProducto);

            if(productoIndex === -1)
            {
                console.log(`en base al id proporcionado:${idProducto}, no se encontro producto alguno a borrar.`);
                return;
            } 
            
            console.log(`encontramos un producto con el id proporcionado (${idProducto}), lo borraremos.`);
            productos.splice(productoIndex, 1);

            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, '\t'));
            return;
            
        }catch(error)
        {
            console.log(error);
        }
    }
}
