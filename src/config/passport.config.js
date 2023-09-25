import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import passportGoogle from "passport-google-oauth20";
import passportJWT from "passport-jwt";
import passportMicrosoft from 'passport-microsoft';
import passportFacebook from 'passport-facebook';
import config from "./environment.config.js";
import dotenv from "dotenv";

dotenv.config();

import { getUserByFilter, getNextId, createUser, findOne } from "../controllers/http/users.controller.js";
import {
    createHash,
    generateToken,
    isValidPassword,
    extractCookie,
} from "./utils.config.js";

const JWTstrategy = passportJWT.Strategy;
const JWTextract = passportJWT.ExtractJwt;
const LocalStrategy = local.Strategy;
const GoogleStrategy = passportGoogle.Strategy;
const MicrosoftStrategy = passportMicrosoft.Strategy;
const FacebookStrategy = passportFacebook.Strategy;



const initializePassport = () => {

    // ------ LOCAL -----
    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "username",
            },
            async (req, username, password, done) => {
                const { email} = req.body;
                try {
                    const user = await getUserByFilter({ username: username });
                    if (user) {
                        console.log("User already exits");
                        return done(null, false);
                    }

                    const newUser = {
                        id: await getNextId(),
                        username,
                        email,
                        password: createHash(password),
                        role: 'user',
                        cartId: await getNextId()

                    };

                    const result = await createUser(newUser); // here too
                    return done(null, result);
                } catch (e) {
                    return done("Error to register " + e);
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "username" },
            async (username, password, done) => {
                try {
                    const user = await getUserByFilter({ username: username });

                    console.log("USERR password: ", user.password);
                    console.log('PASSWORD ES ', password)
                    if (!user) {
                        console.error("User doesn't exist");
                        return done(null, false);
                    }

                    if (!isValidPassword(user, password)) {
                        console.error("Password not valid");
                        return done(null, false);
                    }

                    const token = generateToken(user);
                    user.token = token;

                    return done(null, user);
                } catch (e) {
                    return done("Error login " + e);
                }
            }
        )
    );

    // ------ GITHUB -----
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: "Iv1.9b147dcf42b84167",
                clientSecret: config.github_client_secret,
                callbackURL: "http://127.0.0.1:8080/callback-github",
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log('Profile Github: ', profile);

                try {
                    const email = profile._json.email;
                    const user = await getUserByFilter({ email });
                    if (user) {
                        console.log("User already exits ");
                        return done(null, user);
                    }

                    const newUser = {
                        id: await getNextId(),
                        cartId: await getNextId(),
                        name: profile._json.name,
                        email: profile._json.email,
                        password: "",
                        role: 'user'
                    };
                    const result = await createUser(newUser); // here too
                    console.log(result);

                    const token = generateToken(user);
                    user.token = token;

                    return done(null, user);
                } catch (e) {
                    return done("Error to login with Github" + e);
                }
            }
        )
    );


    // ------ GOOOGLE -----
    passport.use(
        "google",
        new GoogleStrategy(
            {
                clientID: "302635002975-2acnc16p3m0qa1n2pgd052jvj20ecvut.apps.googleusercontent.com",
                clientSecret: config.google_client_secret,
                callbackURL: "http://127.0.0.1:8080/callback-google",
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log('Profile Google: ', profile);
                try {
                    const email = profile.emails[0].value;
                    const name = profile.displayName;

                    const user = await findOne({ email }).lean().exec(); //todo here too
                    if (user) {
                        console.log("Already exits");
                        return done(null, user);
                    }

                    const newUser = {
                        id: await getNextId(),
                        cartId: await getNextId(),
                        name: name, //profile._json.name,
                        email: email, //profile._json.email,
                        password: "",
                        role: 'user'
                    };
                    const result = await createUser(newUser); // here too
                    const token = generateToken(user);
                    user.token = token;

                    return done(null, result);
                } catch (e) {
                    return done("Error to login with Google" + e);
                }
            }
        )
    );


    // ------ MICROSOFT -----
    passport.use('microsoft', new MicrosoftStrategy({
        clientID: "67c5d33d-0922-42f2-9622-d8a65ced798e",
        clientSecret: config.microsoft_client_secret,
        callbackUrl: "http://localhost:8080/callback-microsoft",
        scope: ['user.read']

        //scope: ['user.read']
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('Profile Microsoft: ', profile);
        try {
            const email = profile.EmailAddress;
            const name = profile.DisplayName;

            const user = await findOne({ email }).lean().exec() //todo move to controller

            if (user) {
                console.log("User already exists!");
                return done(null, user);
            }

            const newUser = {
                id: await getNextId(),
                cartId: await getNextId(),
                name,
                email,
                password: "",
                role: "user"
            };
            const result = await createUser(newUser); //here too
            const token = generateToken(user);
            user.token = token;

            return done(null, result);
        } catch (e) {
            return done("Error to login with Microsoft" + e);
        }
    }))



    // ------ FACEBOOK -----
    passport.use('facebook', new FacebookStrategy({
        clientID: "1466211107252395",
        clientSecret: config.facebook_client_secret,
        callbackURL: "http://localhost:8080/callback-facebook",
        profileFields: ["id", "displayName", "email"]
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log('Profile Facebook: ', profile);
            try {
                const email = profile.email;
                const name = profile.displayName;

                const user = await findOne({ email }).lean().exec(); //todo here too
                if (user) {
                    console.log("Already exits");
                    return done(null, user);
                }

                const newUser = {
                    id: await getNextId(),
                    cartId: await getNextId(),
                    name: name, //profile._json.name,
                    email: email, //profile._json.email,
                    password: "",
                    role: 'user'
                };
                const result = await createUser(newUser); // here too
                const token = generateToken(user);
                user.token = token;

                return done(null, result);
            } catch (e) {
                return done("Error to login with Facebook" + e);
            }
        }));


    // Autenticacion. Extrae y valida el JWT
    passport.use('jwt', new JWTstrategy(
        {
            jwtFromRequest: JWTextract.fromExtractors([extractCookie]),
            secretOrKey: config.private_key
        },
        (jwt_payload, done) => {
            console.log({ jwt_payload });
            return done(null, jwt_payload)
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await getUserByFilter({id});
        done(null, user);
    });
};

export default initializePassport;
