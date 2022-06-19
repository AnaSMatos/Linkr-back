import { Router } from "express";

import {
  addLike,
  removeLike,
  getInfoLikes,
} from "./../controllers/likesController.js";
import { authValidator } from "./../middlewares/authValidator.js";
import { validateSchemaInParams } from "./../middlewares/schemaValidator.js";

import likesSchema from "./../schemas/likesSchema.js";

const likesRouter = Router();

likesRouter.use(authValidator);

likesRouter.get(
  "/likes/:postId",
  validateSchemaInParams(likesSchema),
  getInfoLikes,
);
likesRouter.post(
  "/likes/:postId",
  validateSchemaInParams(likesSchema),
  addLike,
);
likesRouter.delete(
  "/likes/:postId",
  validateSchemaInParams(likesSchema),
  removeLike,
);

export default likesRouter;
