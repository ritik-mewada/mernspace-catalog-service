import productModel from "./product-model";
import { Product } from "./product-types";

export class ProductService {
    async createProdcut(product: Product) {
        return await productModel.create(product);
    }
}
