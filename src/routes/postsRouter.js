import {Router} from "express";

import {getPosts, getUserPosts, postPost, getNewPosts} from "../controllers/postsController.js";
import { authValidator } from "../middlewares/authValidator.js";

const postsRouter = Router();

postsRouter.get("/posts", authValidator, getPosts);
postsRouter.get("/new-posts", getNewPosts);
postsRouter.get("/posts/:userId", authValidator, getUserPosts);
postsRouter.post("/posts", postPost);

export default postsRouter;