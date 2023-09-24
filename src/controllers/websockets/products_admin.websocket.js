import config from "./config/environment.config.js";
import { Server } from "socket.io";

export const webSocketConnection = async (app) => {


    const httpServer = async (app) => {
        app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`))
    };

    io = new Server(httpServer(app)); // PRUEBA

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
};