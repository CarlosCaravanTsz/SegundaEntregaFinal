import ProductsModel from "./models/product.model.js";

export default class Product {

    getProducts = async () => { return await ProductsModel.find().lean(); };

    getProductById = async (pid) => { return await ProductsModel.findOne({ id: pid }).lean(); };

    paginateProducts = async (query, params) => { return await ProductsModel.paginate(query, params); };

    addProduct = async (newProduct) => { return await ProductsModel.create(newProduct); };

    updateProduct = async (filter, data) => { return await ProductsModel.findOneAndUpdate(filter, data); };

    deleteProduct = async (filter, data) => { return await ProductsModel.findOneAndDelete(filter, data); };
};
