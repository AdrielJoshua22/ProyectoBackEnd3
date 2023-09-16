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
            enum:['user','admin','superadmin'],
            default: 'user'
        }
    }
)

const userModel = mongoose.model(collection,schema);
export default userModel;