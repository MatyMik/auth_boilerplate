import config from "config";
import { ContextualRequest } from "../types";

import { NextFunction, Response } from "express";

const authMiddleware = async (req: ContextualRequest, res: Response, next: NextFunction) => {};
