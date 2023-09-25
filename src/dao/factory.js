import config from "../config/environment.config.js";

export let User;
export let Cart;
export let Product;

console.log(`Persistence with ${config.persistence}`);

switch (config.persistence) {
    case "MONGO":
        const { default: UserMongo } = await import("./mongo/user.mongo.js");
        const { default: CartMongo } = await import("./mongo/cart.mongo.js");
        const { default: ProductMongo } = await import("./mongo/product.mongo.js");
        User = UserMongo;
        Cart = CartMongo;
        Product = ProductMongo;
        break;

    case "FILE":
        const { default: UserFile } = await import("./files/user.manager.js");
        const { default: CartFile } = await import("./files/cart.manager.js");
        const { default: ProductFile } = await import("./files/product.manager.js");
        User = UserFile;
        Cart = CartFile;
        Product = ProductFile;
        break;

    default:
        console.log("Error reading ENV variable");
        break;
}
