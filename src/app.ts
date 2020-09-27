import express from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import contextMiddleware from "./middlewares/context";
import errorMiddleware from "./middlewares/error";
import auth from "./middlewares/auth";
import authRoutes from "./routes/auth";
import { Context } from "./types";
import "reflect-metadata";
import "./services/db";

export default (context: Context) => {
  const app = express();

  app.use(cors());
  if (context.config.get("morgan.enabled"))
    app.use(morgan(context.config.get("morgan.pattern")));
  app.use(express.json({ limit: "300mb" }));
  app.use(express.urlencoded({ limit: "300mb" }));
  app.use(bodyParser.json({ limit: "300mb" }));
  app.use(bodyParser.urlencoded({ limit: "300mb", extended: true }));
  app.use(cookieParser());
  app.use(contextMiddleware(context));

  app.use("/auth", authRoutes);
  app.use(errorMiddleware);
  return app;
};
