import express from "express";
import { globalErrorHandler } from "./common/middlewares/globalErrorhandler";

const app = express();

app.use(globalErrorHandler);

export default app;
