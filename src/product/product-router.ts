import express from "express";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import { ProductController } from "./product-controller";
import { asyncWrapper } from "../common/utils/wrapper";
import productValidator from "./product-validator";
import { ProductService } from "./product-service";
import fileUpload from "express-fileupload";

const router = express.Router();

const productService = new ProductService();
const productController = new ProductController(productService);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    fileUpload(),
    productValidator,
    asyncWrapper(productController.create),
);

export default router;
