import express from "express";
import categoryRouter from "./category/category-router";
import { globalErrorHandler } from "./common/middlewares/globalErrorhandler";

const app = express();

app.use(express.json());

app.use("/categories", categoryRouter);

app.use(globalErrorHandler);

export default app;
