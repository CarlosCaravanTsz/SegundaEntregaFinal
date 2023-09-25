import { User, Cart, Product } from "../dao/factory.js";
import UserRepository from "./user.repository.js";
import CartRepository from "./cart.repository.js";
import ProductRepository from "./product.repository.js";


export const userService = new UserRepository(new User);
export const cartService = new CartRepository(new Cart);
export const productService = new ProductRepository(new Product);
