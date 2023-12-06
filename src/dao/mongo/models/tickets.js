import mongoose from 'mongoose';

const collection = "tickets";
const schema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      return generateUniqueCode(8);
    },
  },
  purchase_datetime: {
    type: Date,
    default: Date.now, 
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

// generador de codigos (cuasi unicos, nunca hay que tentar a la aleatoriedad)
function generateUniqueCode(length) 
{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
  
    for (let i = 0; i < length; i++) 
    {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  }

const ticketModel = mongoose.model(collection,schema);
export default ticketModel;
