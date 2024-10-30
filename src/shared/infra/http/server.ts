import "dotenv/config";
import "reflect-metadata";
import { datasource } from "../typeorm/dataSource";
import { app } from "./app";
import { logger } from "@config/logger";

const PORT = process.env.PORT;

datasource.initialize().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server running on port: ${PORT}`);
  });
});
