import { body } from "express-validator";

export default [
    body("name")
        .exists()
        .withMessage("topping name is required")
        .isString()
        .withMessage("topping name should be a string"),

    body("price").exists().withMessage("price is required"),
    body("image").custom((value, { req }) => {
        if (!req.files) throw new Error("topping image is required");
        return true;
    }),

    body("tenantId").exists().withMessage("tenant id is required"),
];
