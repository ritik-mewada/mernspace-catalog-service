import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Category, PriceConfiguration } from "./category-types";
import { CategoryService } from "./category-service";
import { Logger } from "winston";

export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger,
    ) {
        this.create = this.create.bind(this);
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { name, priceConfiguration, attributes } = req.body as Category;

        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes,
        });

        this.logger.info(`Created category`, { id: category._id });

        res.json({ id: category._id });
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const categoryId = req.params.id;
        const updateData = req.body as Partial<Category>;

        const existingCategory = await this.categoryService.getOne(categoryId);

        if (!existingCategory) {
            return next(createHttpError(404, "Category not found"));
        }

        if (updateData.priceConfiguration) {
            const existingConfig =
                existingCategory.priceConfiguration instanceof Map
                    ? Object.fromEntries(existingCategory.priceConfiguration)
                    : existingCategory.priceConfiguration;

            const mergedConfig: PriceConfiguration = {
                ...existingConfig,
                ...updateData.priceConfiguration,
            };

            updateData.priceConfiguration = mergedConfig;
        }

        const updatedCategory = await this.categoryService.update(
            categoryId,
            updateData,
        );

        this.logger.info(`updated category`, { id: categoryId });
        res.json({
            id: updatedCategory?._id,
        });
    };

    index = async (req: Request, res: Response) => {
        const categories = await this.categoryService.getAll();
        this.logger.info("getting categories list");
        res.json(categories);
    };

    getOne = async (req: Request, res: Response, next: NextFunction) => {
        const { categoryId } = req.params;
        const category = await this.categoryService.getOne(categoryId);

        if (!category) {
            return next(createHttpError(404, "category not found"));
        }

        this.logger.info(`getting category`, { id: category._id });
        res.json(category);
    };
}
