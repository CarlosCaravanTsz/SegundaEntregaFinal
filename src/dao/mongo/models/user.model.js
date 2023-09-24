import mongoose from "mongoose";

const userCollection = "users";

const UsersModel = new mongoose.model('users', new mongoose.Schema({
    name: String,
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
    cartId: mongoose.Types.ObjectId
}));

export default UsersModel;