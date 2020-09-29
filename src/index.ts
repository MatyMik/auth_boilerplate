require("dotenv").config();
import { create as createContext } from "./context";
import { start as startServer } from "./server";

createContext().then((createdContext) => {
  console.log(createdContext);
  startServer(createdContext);
});
