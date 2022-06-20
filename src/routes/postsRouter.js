import {Router} from "express";

import {getPosts, getUserPosts, postPost} from "../controllers/postsController.js";
import { authValidator } from "../middlewares/authValidator.js";

const postsRouter = Router();

postsRouter.get("/posts", authValidator, getPosts);
postsRouter.get("/posts/:userId", authValidator, getUserPosts);
postsRouter.post("/posts", postPost);

export default postsRouter;