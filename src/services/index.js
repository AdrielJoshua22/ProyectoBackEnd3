
import PersistenceFactory from "../dao/PersistenceFactory.js";
import CartRepository from "./repositories/cartRepository.js";
import ProductRepository from "./repositories/productRepository.js";

const { productsDao, cartsDao } = await PersistenceFactory.getPersistence();

export const productService = new ProductRepository(new productsDao());
export const cartService = new CartRepository(new cartsDao());