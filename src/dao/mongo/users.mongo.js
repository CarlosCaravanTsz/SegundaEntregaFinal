import UsersModel from "./models/users.mongo.model.js";

export default class User {
    getUsers = async () => { return await UsersModel.find() };
    getUserById = async (id) => { return await UsersModel.findOne({ id }) };
    getUserByFilter = async (filter) => { return await UsersModel.find(filter) };
    createUser = async (user) => { return await UsersModel.create(user) };
    getNextId = async () => {
        list = this.getUsers();
        return list.length == 0 ? 1 : list.length + 1;
    };
};