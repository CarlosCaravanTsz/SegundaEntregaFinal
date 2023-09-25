import { createHash } from '../../config/utils.config.js'

export default class UserDTO {
    constructor(user) {
        this.username = user?.username ?? 'Not defined';
        this.email = user?.email ?? 'Not defined';
        this.password = user?.password ?? '',
        this.role = user?.role ?? 'user'
        this.cartId = user?.cartId
    }
};

