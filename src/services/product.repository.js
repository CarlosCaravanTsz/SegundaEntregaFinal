import ProductDTO from "../dao/dto/product.dto.js";

export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async () => {
        return await this.dao.getproducts();
    };

    getProductById = async (pid) => {
        return await this.dao.getProductById(pid);
    }

    paginateProducts = async (query, params) => {
        return await this.dao.paginateProducts(query, params);
    }

    addProduct = async (newProduct) => {
        return await this.dao.addProduct(newProduct);
    };

    updateProduct = async (filter, data) => {
        return await this.dao.updateProduct(filter, data);
    };

    deleteProduct = async (filter) => { // pending to see if this needs a 2nd argument called data
        return await this.dao.deleteProduct(filter);
    };
};
