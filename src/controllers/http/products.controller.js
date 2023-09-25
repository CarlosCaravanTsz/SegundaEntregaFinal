import { productService } from "../../services/index.js";

export const isAdmin = (req, res, next) => {
    req?.session?.user?.role === "admin"
        ? next()
        : res.status(401).redirect("/profile");
};

export const getProductsCatalog = async (req, res) => {

    const page = parseInt(req.query?.page || 1);
    const limit = parseInt(req.query?.limit || 10);
    const pre_query = {
        name: req.query?.name,
        code: req.query?.code,
        stock: req.query?.stock ? { $gt: 0 } : 0,
        category: req.query?.category,
    };
    const query = {};

    for (let key in pre_query) {
        if (pre_query[key]) query[key] = pre_query[key];
    }

    const result = await productService.paginate(query, {
        page,
        limit,
        sort: req.query.price == "Mayor a Menor" ? { price: -1 } : { price: 1 },
        lean: true,
    });

    result.prevLink = result.hasPrevPage
        ? `/products?page=${result.prevPage}&limit=${limit}`
        : "";

    result.nextLink = result.hasNextPage
        ? `/products?page=${result.nextPage}&limit=${limit}`
        : "";

    console.log(result);

    res.render("home", result);
};


export const getProductsAdmin = async (req, res) => {
    const products = await productService.find().lean();
    res.render("admin", { products });
};


/// ESTAS FUNCIONES DEBEN HACERSE POR WEBSOCKETS!!!!
export const addProduct = async (req, res) => {
    try {
        const newProduct = {
            name: req?.body?.name,
            description: req?.body?.description,
            code: req?.body?.code,
            price: req?.body?.price,
            status: true,
            stock: req?.body?.stock,
            category: req?.body?.category,
            thumbnail: req?.body?.thumbnail,
        };

        const result = await productService.addProduct(newProduct);
        const status = result ? result : { status: "Error al agregar producto" };
        res.status(200).send(status);
    } catch {
        res.status(500).send({ status: "ERROR al agregar un producto" });
    }
}
