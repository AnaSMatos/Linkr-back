import {Router} from "express";

import {getPosts, getUserPosts, postPost, deletePost} from "../controllers/postsController.js";
import { authValidator } from "../middlewares/authValidator.js";

const postsRouter = Router();

postsRouter.get("/posts", authValidator, getPosts);
postsRouter.get("/posts/:userId", authValidator, getUserPosts);
postsRouter.post("/posts", postPost);
postsRouter.delete("/posts/:postId", deletePost);

export default postsRouter;