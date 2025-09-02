import app from "./app";
import config from "config";
import logger from "./config/logger";

const startServer = () => {
    const PORT: number = config.get("server.port");
    try {
        app.listen(PORT, () => logger.info(`listening on PORT ${PORT}`));
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(err.message);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        }
    }
};

startServer();
