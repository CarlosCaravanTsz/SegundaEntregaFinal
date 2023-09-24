// Libraries and external sources
import express, { urlencoded } from 'express';
import cookieParser from "cookie-parser";
import passport from 'passport';
import session from "express-session";

import __dirname from "./config/utils.config.js";
import config from "./config/environment.config.js";
import viewsRouter from "./router/views.router.js"
import cartRouter from "./router/cart.router.js"
import chatRouter from "./router/chat.router.js"
import productRouter from "./router/chat.router.js";
import userRouter from "./router/chat.router.js";


const app = express();

// Handlebars config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//Cookies config
app.use(cookieParser(config.COOKIE_TOKEN));
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    }));

// Public&static config
app.use('/static', express.static(__dirname + '/public'));

//Post JSON config
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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


if(config.PERSISTANCE != 'MONGO') app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`));








