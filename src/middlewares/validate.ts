import { body } from "express-validator";
const PASSWORD_MIN_LENGTH = 5;

export const validateSignup = [
  body("email").isEmail(),
  body("password").isLength({ min: PASSWORD_MIN_LENGTH }),
  body("confirmPassword").isLength({ min: PASSWORD_MIN_LENGTH }),
  body("username").isLength({ min: 1 }),
];
