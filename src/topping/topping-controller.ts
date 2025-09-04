import { NextFunction, Request, Response } from "express";
import { FileStorage } from "../common/types/storage";
import { ToppingService } from "./topping-service";
import { CreateRequestBody, Topping } from "./topping-types";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from "uuid";

export class ToppingController {
    constructor(
        private storage: FileStorage,
        private toppingService: ToppingService,
    ) {}
    create = async (
        req: Request<object, object, CreateRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const image = req.files!.image as UploadedFile;
        const fileUuid = uuidv4();

        await this.storage.upload({
            filename: fileUuid,
            fileData: image.data.buffer as ArrayBuffer,
        });

        const savedTopping = await this.toppingService.create({
            ...req.body,
            image: fileUuid,
            tenantId: req.body.tenantId,
        } as Topping);

        res.json({ id: savedTopping._id });
    };
    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const toppings = await this.toppingService.getAll(
                req.query.tenantId as string,
            );

            const readyToppings = toppings.map((topping) => {
                return {
                    id: topping._id,
                    name: topping.name,
                    price: topping.price,
                    tenantId: topping.tenantId,
                    image: this.storage.getObjectUri(topping.image),
                };
            });
            res.json(readyToppings);
        } catch (err) {
            next(err);
        }
    };
}
