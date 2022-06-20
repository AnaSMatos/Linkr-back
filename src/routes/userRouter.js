import {Router} from "express";

import getUser from "../controllers/userController.js";
import { authValidator } from "../middlewares/authValidator.js";

const userRouter = Router();

userRouter.get("/user/:id", authValidator, getUser);

export default userRouter;