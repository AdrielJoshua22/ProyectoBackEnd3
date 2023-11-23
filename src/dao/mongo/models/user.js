import mongoose from "mongoose";

const collection = "Users";
const schema = new mongoose.Schema(
    {
        firstName:String,
        lastName:String,
        email:String,
        age:Number,
        password:String,
        role:
        {
            type:String,
            enum:['user','admin','superadmin','premium'],
            default: 'user'
        },
        resetToken: 
        {
            type:String,
            default: ''
        },
        resetTokenExpiry: 
        {
            type:Date,
            default: ''
        }
    }
)

const userModel = mongoose.model(collection,schema);
export default userModel;