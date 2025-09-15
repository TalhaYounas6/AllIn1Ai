import "dotenv/config";
import app from "./app.js";
import http from "http";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { sequelize } = require('./models/index.cjs');

const port = process.env.PORT || 3000;
const module = require.main;
if (require.main === module) {
  const server = http.Server(app);

  const startServer = async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection to PostgreSQL has been established successfully.');

      server.listen(port, () => {
        console.log(`App is listening on port ${port}`);
      });

      const exitHandler = () => {
        if (server) {
          server.close(() => {
            console.log("Server closed");
            process.exit(1);
          });
        } else {
          process.exit(1);
        }
      };

      const unexpectedErrorHandler = (error) => {
        console.log(error);
        exitHandler();
      };

      process.on("uncaughtException", unexpectedErrorHandler);
      process.on("unhandledRejection", unexpectedErrorHandler);
      process.on("SIGTERM", () => {
        console.log("SIGTERM received");
        if (server) {
          server.close();
        }
      });

    } catch (error) {
      console.error('Unable to connect to the databases:', error);
      process.exit(1);
    }
  };

  startServer();
}

export default app;
//for vercel