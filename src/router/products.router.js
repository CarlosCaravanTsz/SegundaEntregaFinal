
import { Router } from "express";
import {getProductsCatalog, getProductsAdmin, isAdmin} from '../controllers/http/products.controller.js'

const router = Router();

router.get("/home", getProductsCatalog);

router.get("/admin", isAdmin, getProductsAdmin);


export default router;