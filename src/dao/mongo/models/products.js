import mongoose, { mongo } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";                //nombre de mi coleccion
const schema = new mongoose.Schema({          //esquema de carga de datos de mi colleccion
    title: {        
        type:String,
        required:true
    },
    description: {        
        type:String,
        required:true
    },
    category: {        
        type:String,
        enum:["Malbec", "Carmenere", "Tannat", "Merlot", "Cabernet Sauvignon"],
        required:true,
        index: true
    },
    code: {        
        type:String,
        required:true
    },
    status: {        
        type:Boolean,
        required:true,
        index:true
    },
    stock: {        
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    thumbnail:
    {
        type: Array,
        default: []
    }
},{timestamps:true}) //cada vez que cree un dato va a agregar cuando se creo y cuando se actualizo por ultima vez por defecto.

schema.plugin(mongoosePaginate);
const productsModel = mongoose.model(collection,schema);

export default productsModel;