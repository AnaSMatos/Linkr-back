import { Router } from "express";

import { validateSchema } from "./../middlewares/schemaValidator.js";
import { authValidator } from "./../middlewares/authValidator.js";
import { logout } from "./../controllers/authController.js";

import authSchema from "./../schemas/authSchema.js";

const authRouter = Router();

authRouter.post("/logout", validateSchema(authSchema), authValidator, logout);

export default authRouter;
