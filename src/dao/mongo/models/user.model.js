import mongoose from "mongoose";

const userCollection = "users";

const UsersModel = new mongoose.model(userCollection, new mongoose.Schema({
    username: String,
    email: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    cartId: Number//mongoose.Types.ObjectId
}));

export default UsersModel;