import { Router } from "express";

import { authValidator } from "../middlewares/authValidator.js";
import { validateSchemaInQuery } from "../middlewares/schemaValidator.js";
import { searchSchema } from "../schemas/userSchema.js";

import { getUsersBySearch, getUser } from "../controllers/userController.js";

const userRouter = Router();

userRouter.use(authValidator);

userRouter.get("/user/:id", getUser);
userRouter.get(
  "/search",
  validateSchemaInQuery(searchSchema),
  getUsersBySearch,
);

export default userRouter;
