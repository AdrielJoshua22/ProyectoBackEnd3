import ProductRepository from "./repositories/ProductRepository.js";
import CartRepository from "./repositories/CartRepository.js";
import PersistenceFactory from "../dao/PersistenceFactory.js";
import TicketRepository  from "./repositories/TicketRepository.js";
import UserRepository from "./repositories/UserRepository.js";


const { productsDao, cartsDao, ticketsDao, usersDao } = await PersistenceFactory.getPersistence();

export const productService = new ProductRepository(new productsDao());
export const cartService = new CartRepository(new cartsDao());
export const ticketService = new TicketRepository(new ticketsDao());
export const userService = new UserRepository(new usersDao());