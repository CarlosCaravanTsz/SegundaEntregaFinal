import UserDTO from "../dao/dto/user.dto.js";

export default class UserRepository {

    constructor(dao) {
        this.dao = dao;
    }

    getUsers = async () => {
        return await this.dao.getUsers();
    };

    getUserById = async (id) => {
        return await this.dao.getUserById(id);
    };

    getUserByFilter = async (filter) => {
        return await this.dao.getUserByFilter(filter);
    }

    createUser = async (user) => {
        const userToInsert = new UserDTO(user);
        return await this.dao.createUser(userToInsert);
    };

    getNextId = async () => { return await this.dao.getNextId() };
};
