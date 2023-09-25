
export default class ProductDTO {
    constructor(user) {
        this.name = user?.name ?? null,
            this.description = user?.description ?? null,
            this.code = user?.code ?? null,
            this.price = user?.price ?? null,
            this.status = user?.status ?? true,
            this.stock = user?.stock ?? 1,
            this.category = user?.category ?? null,
            this.thumbnail = user?.thumbnail ?? null,
            this.id = user?.id ?? null
    };
};
