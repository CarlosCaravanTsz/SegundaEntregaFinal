import dotenv from "dotenv";

dotenv.config();

export default {
    persistence: process.env.PERSISTENCE || 'MONGO',
    port: process.env.PORT || 8080,
    db_url:
        process.env.dbUrl ||
        "mongodb+srv://carloscara28:DnERG59KflAo9jen@carlosbackenddb.44mn6xw.mongodb.net/?retryWrites=true&w=majority",
    db_name: process.env.dbName || 'ecommerce',
    private_key: process.env.PRIVATE_KEY || 'SecretForJWTCoderhouse',
    cookie_token: process.env.COOKIE_TOKEN || 'jwtToken',
    session_secret: process.env.SESSION_SECRET || 'secretSessionKey',

};

