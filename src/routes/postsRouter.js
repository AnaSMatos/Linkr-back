import {Router} from "express";

import {getPosts, postPost} from "../controllers/postsController.js";
import { authValidator } from "../middlewares/authValidator.js";

const postsRouter = Router();

postsRouter.get("/posts",authValidator, getPosts);
postsRouter.post("/posts", postPost);

export default postsRouter;