import { ContextualRequest } from "../types";
import { NextFunction, Response } from "express";
import {
  throwErrorIfUserNotFound,
  checkPasswordValidity,
  throwErrorIfUserAlreadyExists,
} from "../utils/auth";
import { hashPassword } from "../utils/encrypt";
import { User } from "../models/User";

export class AuthController {
  async login(req: ContextualRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const { userService } = req.context;
    try {
      const user = await userService.findOneByEmail(email);
      throwErrorIfUserNotFound(user);
      const passwordValidaty = await userService.validatePassword(password, user.password);
      checkPasswordValidity(passwordValidaty);
    } catch (err) {
      next(err);
    }

    // attach stuff to session
  }

  async register(req: ContextualRequest, res: Response, next: NextFunction) {
    const { email, password, confirmPassord, username } = req.body;
    const { userService } = req.context;
    try {
      const user = await userService.findOneByEmail(email);
      throwErrorIfUserAlreadyExists(user);
      const hashedPassword = await hashPassword(password);
      await userService.addNewUser(email, hashedPassword, username);
    } catch (err) {
      next(err);
    }
  }
}
