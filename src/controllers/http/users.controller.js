import { userService } from "../services/index.js";

export const isAdmin = async (req, res, next) => {
    req?.session?.user?.role === "admin"
        ? next()
        : res.status(401).redirect("/profile");
};

export const auth = async (req, res, next) => {
    if (req.session?.user) return next();
    res.status(400).redirect("/");
};

export const getProfile = async (req, res) => {
    const user = req.session.user || req.user;
    res.status(201).render("profile", { user });
}

export const logOut = async (req, res) => {
    if (req.session) req.session.destroy();
    return res.redirect("/");
};

export const userLogIn = async (req, res) => {
    if (!req.user) return res.status(400).send('Invalid Credentials')
    req.session.user = req.user
    res.cookie("JWTCookie", req.user.token).redirect("/home");

    return res.redirect('/profile')
};

export const redirectLogin = async (req, res) => { res.redirect("/login"); };

export const emptyFunction = async (req, res) => { };

export const redirectProfile = async (req, res) => res.redirect('/profile');

export const getUserByFilter = async (filter) => { return await userService.getUserByFilter(filter); };

export const getNextId = async () => { return userService.getNextId(); };

export const createUser = async (newUser) => { return userService.createUser(newUser); };

export const findOne = async (filter) => { return await userService.findOne(filter).lean().exec(); };