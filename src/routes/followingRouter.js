import { Router } from "express";

import {
  addFollower,
  removeFollower,
  isFollowing,
} from "./../controllers/followingController.js";
import { authValidator } from "../middlewares/authValidator.js";
import { validateSchemaInParams } from "./../middlewares/schemaValidator.js";

import followingSchema from "./../schemas/followingSchema.js";

const followingRouter = Router();

followingRouter.use(authValidator);

followingRouter.get(
  "/following/:id",
  validateSchemaInParams(followingSchema),
  isFollowing,
);
followingRouter.post(
  "/following/:id",
  validateSchemaInParams(followingSchema),
  addFollower,
);
followingRouter.delete(
  "/following/:id",
  validateSchemaInParams(followingSchema),
  removeFollower,
);

export default followingRouter;
