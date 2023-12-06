import ticketModel from "../models/tickets.js";

export default class TicketsDao 
{
    createTicket = async (userId, cartId, amount) => 
    {
        try {
            const ticket = new ticketModel({amount,purchaser: userId});
            
            const savedTicket = await ticket.save();
            return savedTicket;
        } catch (error) {
            throw error;
        }
    };
}
