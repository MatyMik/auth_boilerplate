import { UserNotFoundError, ValidationError, UserAlreadyExists } from "../utils/errors";
import { User } from "../models/User";
import { ContextualRequest } from "../types";

export const throwErrorIfUserNotFound = (user: User) => {
  if (!user) {
    throw UserNotFoundError;
  }
};

export const throwErrorIfUserAlreadyExists = (user: User) => {
  if (user) {
    throw UserAlreadyExists;
  }
};

export const checkPasswordValidity = (passwordValidity: boolean) => {
  if (!passwordValidity) {
    throw ValidationError;
  }
};

export const addUserToSession = (req: ContextualRequest, user: User) => {
  req.session.user = user;
};
