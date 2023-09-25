import UsersModel from "./models/user.model.js";

export default class User {
    getUsers = async () => { return await UsersModel.find() };
    getUserById = async (id) => { return await UsersModel.findOne({ id }) };
    getUserByFilter = async (filter) => { return await UsersModel.findOne(filter) };
    createUser = async (user) => { return await UsersModel.create(user) };
    getNextId = async () => {
        const list = await this.getUsers();
        return parseInt(list.length == 0 ? 1 : list.length + 1);
    };
};