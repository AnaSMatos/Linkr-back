import { Router } from "express";

import { authValidator } from "./../middlewares/authValidator.js";
import { validateSchemaInQuery } from "./../middlewares/schemaValidator.js";
import { searchSchema } from "./../schemas/userSchema.js";

import { getUsersBySearch } from "./../controllers/usersController.js";

const usersRouter = Router();

usersRouter.use(authValidator);

usersRouter.get(
  "/search",
  validateSchemaInQuery(searchSchema),
  getUsersBySearch,
);

export default usersRouter;
