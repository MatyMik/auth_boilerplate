import express from "express";
import "express-async-errors";
import session from "express-session";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import contextMiddleware from "./middlewares/context";
import errorMiddleware from "./middlewares/error";
import authRoutes from "./routes/auth";
import { Context } from "./types";
import "reflect-metadata";
import { TypeormStore } from "typeorm-store";
import { Session } from "./models/Session";
import { getConnection } from "typeorm";
import helmet from "helmet";

export default (context: Context) => {
  console.log(context.db.getRepository(Session));
  const app = express();
  const repository = getConnection().getRepository(Session);

  app.use(cors());
  app.use(helmet());
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
      store: new TypeormStore({ repository }),
    })
  );
  if (context.config.get("morgan.enabled")) app.use(morgan(context.config.get("morgan.pattern")));
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
