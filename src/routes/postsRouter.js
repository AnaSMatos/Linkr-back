import {Router} from "express";

import {getPosts, getUserPosts, postPost, deletePost, updatePost, getNewPosts} from "../controllers/postsController.js";
import { authValidator } from "../middlewares/authValidator.js";
import { validateSchema } from "./../middlewares/schemaValidator.js";
import {postPostSchema,putPostSchema} from "../schemas/postsSchema.js";

const postsRouter = Router();

postsRouter.get("/posts", authValidator, getPosts);
postsRouter.get("/new-posts", getNewPosts);
postsRouter.get("/posts/:userId", authValidator, getUserPosts);
postsRouter.post("/posts",validateSchema(postPostSchema), authValidator,postPost);
postsRouter.delete("/posts/:postId", authValidator,deletePost);
postsRouter.put("/posts",validateSchema(putPostSchema) ,authValidator,updatePost);

export default postsRouter;