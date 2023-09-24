import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import passportGoogle from "passport-google-oauth20";
import passportJWT from "passport-jwt";
import { getUserByFilter, getNextId, createUser, findOne } from "../controllers/http/users.controller.js";
import {
    createHash,
    generateToken,
    isValidPassword,
    extractCookie,
} from "./utils.config.js";
import config from "./config/environment.config.js";

const JWTstrategy = passportJWT.Strategy;
const JWTextract = passportJWT.ExtractJwt;
const LocalStrategy = local.Strategy;
const GoogleStrategy = passportGoogle.Strategy;


const initializePassport = () => {

    // ------ LOCAL -----
    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, username, password, done) => {
                const { name, email } = req.body;
                try {
                    const user = await getUserByFilter({ email: username });
                    if (user) {
                        console.log("User already exits");
                        return done(null, false);
                    }

                    const newUser = {
                        id: await getNextId(),
                        name,
                        email,
                        password: createHash(password),
                        role: 'user',
                        cartId: await getNextId()

                    };

                    const result = await createUser(newUser); // here too
                    return done(null, result);
                } catch (e) {
                    return done("Error to register " + error);
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await getUserByFilter({ email: username });

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
                    return done("Error login " + error);
                }
            }
        )
    );

    // ------ GITHUB -----
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: "Iv1.42ae653ed8a66872",
                clientSecret: "7eff1a591930fc3823944a2934e421ebdda6dba9",
                callbackURL: "http://127.0.0.1:8080/githubcallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log(profile);

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
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: "http://127.0.0.1:8080/callback-google",
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log(profile);
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
                        name: profile._json.name,
                        email: profile._json.email,
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

    // ------ FACEBOOK -----

    // Autenticacion. Extrae y valida el JWT
    passport.use('jwt', new JWTstrategy(
        {
            jwtFromRequest: JWTextract.fromExtractors([extractCookie]),
            secretOrKey: config.PRIVATE_KEY
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
        const user = await UserModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;
