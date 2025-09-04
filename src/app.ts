import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import categoryRouter from "./category/category-router";
import productRouter from "./product/product-router";
import { globalErrorHandler } from "./common/middlewares/globalErrorhandler";

const app = express();

const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "Cache-Control",
        "X-Auth-Token",
    ],
    exposedHeaders: ["X-Auth-Token"],
    optionsSuccessStatus: 200,
    preflightContinue: false,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/categories", categoryRouter);
app.use("/products", productRouter);

app.use(globalErrorHandler);

export default app;
