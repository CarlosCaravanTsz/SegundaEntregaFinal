import config from "../config/config.js";
import config from "../config/environment.config.js";

import mongoose from "mongoose";
import express from 'express';

export let User;
export let Cart;
export let Product;

console.log(`Persistence with ${config.PERSISTENCE}`);

switch (config.PERSISTENCE) {

    case "MONGO":
        mongoose.connect(config.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: config.DB_NAME,
        }).then(() => console.log("Connected to e-coomerce DB...")).then(() => {
            const app = express();

            const httpServer = app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`));

            const io = new Server(httpServer);

            io.on("connection", (socket) => {
                socket.on("operation", async (data) => {
                    const { operation } = data;
                    delete data.operation;
                    //console.log("PRODUCTO RECIBIDO TESTING: ", data);

                    if (operation == "add") {
                        data.status = true;

                        let products = await productModel.find().lean();

                        data.id = add_id(products);

                        console.log("Product to create: ", data);
                        await productModel.create(data);

                        products = await productModel.find().lean();

                        socket.emit("reload-table", products);
                    } else if (operation == "update") {
                        const filter = { id: data.id };
                        const obj = await productModel.findOneAndUpdate(filter, data);
                        console.log("UPDATED PRODUCT: ", obj);
                        const products = await productModel.find().lean();
                        socket.emit("reload-table", products);
                    } else if (operation == "delete") {
                        const filter = { id: data.id };
                        const obj = await productModel.findOneAndDelete(filter, data);
                        console.log("DELETED PRODUCT: ", obj);
                        const products = await productModel.find().lean();
                        socket.emit("reload-table", products);
                    } else {
                        console.log({ status: "ERROR: Operacion no encontrada" });
                    }
                });
            });
        })

        let { default: UserMongo } = await import("./mongo/users.mongo.js");
        let { default: CartMongo } = await import("./mongo/cart.mongo.js");
        let { default: ProductMongo } = await import("./mongo/products.mongo.js");
        User = UserMongo;
        Cart = CartMongo;
        Product = ProductMongo;
        break;


    case "FILE":
        const { default: UserFile } = await import("./mongo/users.mongo.js");
        const { default: CartFile } = await import("./mongo/cart.mongo.js");
        const { default: ProductFile } = await import("./mongo/products.mongo.js");
        User = UserFile;
        Cart = CartFile;
        Product = ProductFile;
        break;


    default:
        break;
}
