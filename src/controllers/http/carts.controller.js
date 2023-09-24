import { cartService, productService } from "../../services/index.js"

export const createCart = async (req, res) => {
    try {
        const newCart = { products: [], };
        await cartService.createCart(newCart);
        const carts = await cartService.getCarts();
        res.status(200).send(carts);
    } catch {
        res.status(500).send({ status: "ERROR al crear un carrito" });
    }
};
export const getProductsByCartId = async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const result = await cartService.getProductsByCartId({ id: cid });
        res.status(200).render("cart", result);
    } catch {
        res.status(500).send({ status: 'Error al consultar la lista de carritos' });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);

        const cart = await cartService.getCartById({ id: cid });
        const product = await productService.getProductById({ id: pid });

        const idx = cart.products.findIndex(p => p.pid == pid);
        if (cart.products.length == 0 || idx == -1) {
            const new_product = { p_id: product._id, quantity: 1 };
            await cartService.updateProductInCart({ id: cid }, { $push: { products: new_product } });
            res.status(200).send({ status: `Producto ${pid} agregado exitosamente al Carrito ${cid}` });
        } else {
            await cartService.updateProductInCart({ "products.pid": pid }, { $inc: { "products.$.quantity": 1 } });
            res.status(200).send({ status: `Producto ${pid} actualizado exitosamente al Carrito ${cid}` });
        }
    } catch {
        res.status(500).send({ status: "ERROR al agregar producto al carrito" });
    }
}

export const deleteProductFromCart = async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);

        const cart = await cartService.getCartById({ id: cid });

        const idx = cart.products.findIndex(p => p.pid == pid);

        if (idx >= 0 && cart.products[idx].quantity == 1) {
            await cartService.updateProductInCart({ id: cid }, { $pull: { products: { pid: pid } } });
            res.status(200).send({ status: `Producto ${pid} eliminado exitosamente del Carrito ${cid}` });
        } else {
            await cartService.updateProductInCart({ "products.pid": pid }, { $inc: { "products.$.quantity": -1 } });
            res.status(200).send({ status: `Se ha decrementado en 1 la cantidad del producto ${pid} en el Carrito ${cid}` });
        }
    } catch {
        res.status(500).send({ status: "ERROR al eliminar poducto del carrito" });
    }
};

export const makePurchase = async(req, res) => {} //TODO: PENDING