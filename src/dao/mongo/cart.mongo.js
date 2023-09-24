import CartsModel from "./models/cart.mongo.model.js";

export default class Cart {
    createCart = async (newCart) => { return await CartsModel.create(newCart); };

    getCarts = async() => { return await CartsModel.find().lean(); };

    getCartById = async (cid) => { return await CartsModel.findOne(cid); };

    getProductsByCartId = async (cid) => { return await CartsModel.findOne(cid).populate("products.p_id").lean(); };

    updateProductInCart = async (filter, modifier) => { return await CartsModel.updateOne(filter, modifier); };

}
