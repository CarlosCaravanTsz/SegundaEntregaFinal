import { Router } from "express";
import {
    isAdmin,
    auth,
    getProfile,
    logOut,
    userLogIn,
    redirectLogin,
    emptyFunction,
    redirectProfile,
} from "../controllers/http/users.controller.js";

const router = Router();

router.get("/profile", auth, passport.authenticate("jwt", { session: false }), getProfile);
router.get("/home", auth, async() => { res.render('/home')});


// Local
router.get('/logout', logOut);
router.post('/login', passport.authenticate('login', '/login'), userLogIn);
router.post('/register', passport.authenticate('register', { failureRedirect: '/register' }), redirectLogin);

//Google
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }), emptyFunction);
router.get("/callback-google", passport.authenticate("google", { failureRedirect: "/" }), userLogIn);


// Github
router.get('/login-github', passport.authenticate('github', { scope: ['user:email'] }), emptyFunction);
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), userLogIn);




export default router;
