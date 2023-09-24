import dotenv from "dotenv";

dotenv.config();

export default {
    PERSISTANCE: process.env.PERSISTENCE,
    PORT: process.env.PORT || 8080,
    DB_URL:
        process.env.dbUrl ||
        "mongodb+srv://carloscara28:DnERG59KflAo9jen@carlosbackenddb.44mn6xw.mongodb.net/?retryWrites=true&w=majority",
    DB_NAME: process.env.dbName || 'ecommerce',
    PRIVATE_KEY: process.env.PRIVATE_KEY || 'SecretForJWTCoderhouse',
    COOKIE_TOKEN: process.env.COOKIE_TOKEN || 'jwtToken',
    SESSION_SECRET: process.env.SESSION_SECRET || 'secretSessionKey',

};

