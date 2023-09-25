import CartDTO from "../dao/dto/cart.dto.js";

export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    };

    createCart = async (newCart) => {
        const newCartd = new CartDTO(newCart);
        return await this.dao.createCart(newCartd);
    };

    getCarts = async () => {
        return await this.dao.getCarts();
    };

    getCartById = async (cid) => {
        return await this.dao.getCartById(cid);
    };

    getProductsByCartId = async (cid) => {
        return await this.dao.getProductsByCartId(cid);
    };

    updateProductInCart = async (filter, modifier) => {
        return await this.dao.updateProductInCart(filter, modifier);
    };

}
