import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("Product name is required")
        .isString()
        .withMessage("Product name should be a string"),

    body("description").exists().withMessage("Description is required"),

    body("priceConfiguration")
        .exists()
        .withMessage("Price Configuration is required"),

    body("attributes").exists().withMessage("Attributes fields is required"),
    body("tenantId").exists().withMessage("Tenant id field is required"),
    body("categoryId").exists().withMessage("Category id field is required"),
];
