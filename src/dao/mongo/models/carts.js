import mongoose from "mongoose";

const collection = "carts"; 

const productSchema = new mongoose.Schema({
    id_product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products', 
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
},{_id:false});

const schema = new mongoose.Schema({
    products: {
        type: [productSchema],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true
    }                      
}, { timestamps: true });                               

const cartsModel = mongoose.model(collection, schema);

export default cartsModel;