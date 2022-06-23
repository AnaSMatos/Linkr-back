import {Router} from "express";

<<<<<<< HEAD
import {getPosts, getUserPosts, postPost, deletePost, updatePost} from "../controllers/postsController.js";
=======
import {getPosts, getUserPosts, postPost, deletePost, getNewPosts} from "../controllers/postsController.js";
>>>>>>> ff6e9a3db87d83175f79fa02d3b47e9f94f1e7fa
import { authValidator } from "../middlewares/authValidator.js";

const postsRouter = Router();

postsRouter.get("/posts", authValidator, getPosts);
postsRouter.get("/new-posts", getNewPosts);
postsRouter.get("/posts/:userId", authValidator, getUserPosts);
postsRouter.post("/posts", postPost);
postsRouter.delete("/posts/:postId", deletePost);
postsRouter.put("/posts", updatePost);

export default postsRouter;