import express from "express";
import createHttpError from "http-errors";
import fileUpload from "express-fileupload";
import { ToppingService } from "./topping-service";
import { ToppingController } from "./topping-controller";
import { S3Storage } from "../common/services/S3Storage";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
import createToppingValidator from "./create-topping-validator";
import { asyncWrapper } from "../common/utils/wrapper";

const router = express.Router();

const toppingService = new ToppingService();
const toppingController = new ToppingController(
    new S3Storage(),
    toppingService,
);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 },
        abortOnLimit: true,
        limitHandler: (req, res, next) => {
            const error = createHttpError(400, "file size exceeds the limit");
            next(error);
        },
    }),
    createToppingValidator,
    asyncWrapper(toppingController.create),
);

router.get("/", asyncWrapper(toppingController.get));

export default router;
