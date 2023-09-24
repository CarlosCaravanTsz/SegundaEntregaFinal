import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bcrypt from "bcrypt";
import config from "./environment.config.js"

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password); // true o false
};


// Generamos el token
export const generateToken = (user) => {
    const token = jwt.sign( {user}, config.PRIVATE_KEY, {expiresIn: '24h'})
    return token
}

// Extraemos el token del header
export const authToken = (req, res, next) => {
    let token = req.headers.auth ?? req?.cookies["JWTCookie"] ?? null;

    if (!token) return res.status(401).send({ error: 'No authentication' });

    jwt.verify(token, config.PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: 'Not authroized' })

        req.user = credentials.user
        next()
    })
};

export const extractCookie = (req) => {
    return req?.cookies["JWTCookie"] ?? null; //poner en env
};


export default __dirname;
