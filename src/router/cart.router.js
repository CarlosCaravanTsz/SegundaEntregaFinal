import { Router } from "express";
import {
    createCart,
    getProductsByCartId,
    addProductToCart,
    deleteProductFromCart,
    makePurchase,
} from "../controllers/http/carts.controller.js";

const router = Router();

router.post("/", createCart);
router.get('/:cid', getProductsByCartId); // aqui se mostraria el carrito por tanto iria el populate
router.post('/:cid/product/:pid', addProductToCart);
router.post("/:cid/purchase", makePurchase);
router.delete("/:cid/product/:pid", deleteProductFromCart);

export default router;
