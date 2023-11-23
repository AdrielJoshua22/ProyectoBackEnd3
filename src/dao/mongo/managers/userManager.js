import userModel from "../models/user.js";

export default class UserManager
{
    get =()=>
    {
        return userModel.find().lean();
    }

    getBy =(param)=>
    {
        return userModel.findOne(param).lean();
    }

    getByMongose =(param)=>
    {
        return userModel.findOne(param);
    }

    create = (user)=>{
        return userModel.create(user);
    }

    getUserByResetToken = (token) => 
    {
        return userModel.findOne({ resetToken: token });
    }

    changeUserRole = async (userId) => 
    {
        try 
        {
          const user = await userModel.findById(userId);
      
          if (!user) return null;
      
          user.role = user.role === 'user' ? 'premium' : 'user';
          const updatedUser = await user.save();
          return updatedUser;
        } catch (error) 
        {
          console.error(error);
          throw error;
        }
    };

    getUserById = async (userId) => 
    {
        try 
        {
            const user = await userModel.findOne({ '_id': userId });
            return user;
        } catch (error) 
        {
            throw error;
        }
    }
      
}