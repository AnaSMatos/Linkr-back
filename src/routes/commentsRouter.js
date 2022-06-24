import { Router } from "express";

import {
  postComment,
  getComments,
  getContComments,
} from "../controllers/commentsController.js";
import { authValidator } from "../middlewares/authValidator.js";
import {
  validateSchema,
  validateSchemaInParams,
} from "./../middlewares/schemaValidator.js";
import {
  commentSchema,
  commentSchemaParams,
} from "./../schemas/commentSchema.js";

const commentsRouter = Router();

commentsRouter.use(authValidator);

commentsRouter.post("/comments", validateSchema(commentSchema), postComment);
commentsRouter.get(
  "/comments/:postId",
  validateSchemaInParams(commentSchemaParams),
  getComments,
);
commentsRouter.get(
  "/comments/count/:postId",
  validateSchemaInParams(commentSchemaParams),
  getContComments,
);

export default commentsRouter;
