// Libraries and external sources
import express, { urlencoded } from 'express';
import cookieParser from "cookie-parser";
import passport from 'passport';
import session from "express-session";
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import initializePassport from "./config/passport.config.js";

import __dirname from "./config/utils.config.js";
import config from "./config/environment.config.js";
import viewsRouter from "./router/views.router.js"
import cartRouter from "./router/cart.router.js"
import chatRouter from "./router/chat.router.js"
import productRouter from "./router/products.router.js";
import userRouter from "./router/user.router.js";

// para websockets
import { productService } from "./services/index.js";


const app = express();

//Post JSON config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public&static config
app.use('/static', express.static(__dirname + '/../public'));


// Handlebars config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

//Cookies config
app.use(cookieParser(config.cookie_token));
app.use(
    session({
        secret: config.session_secret,
        resave: true,
        saveUninitialized: true,
    }));

// Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


// Routes
app.use("/", viewsRouter); //login/register
app.use("/", productRouter); // products catalog
app.use("/", userRouter); // autentication and user handling
app.use("/api/carts", cartRouter);
app.use("/chat", chatRouter);


const httpServer = app.listen(config.port, () =>
    console.log(`Listening on port ${config.port}`)
);


if (config.persistence == 'MONGO') {
    mongoose
        .connect(config.db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: config.db_name,
        })
        .then(() => console.log("Connected to e-commerce DB..."))
        .then(() => {

            const io = new Server(httpServer);

            io.on("connection", (socket) => {
                socket.on("operation", async (data) => {
                    const { operation } = data;
                    delete data.operation;
                    //console.log("PRODUCTO RECIBIDO TESTING: ", data);

                    if (operation == "add") {
                        data.status = true;

                        let products = await productService.getProducts();
                        data.id = add_id(products);

                        console.log("Product to create: ", data);
                        await productService.addProduct(data);

                        products = await productService.getProducts();

                        socket.emit("reload-table", products);

                    } else if (operation == "update") {
                        const filter = { id: data.id };
                        const obj = await productService.updateProduct(filter, data);
                        console.log("UPDATED PRODUCT: ", obj);
                        const products = await productService.getProducts();
                        socket.emit("reload-table", products);

                    } else if (operation == "delete") {
                        const filter = { id: data.id };
                        const obj = await productService.deleteProduct(filter);
                        console.log("DELETED PRODUCT: ", obj);
                        const products = await productService.getProducts();
                        socket.emit("reload-table", products);

                    } else {
                        console.log({ status: "ERROR: Operacion no encontrada" });
                    }
                });
            });
        });
}

//app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`));








