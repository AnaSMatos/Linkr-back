import {Router} from "express";

import {getPosts, postPost} from "../controllers/postsController.js";

const postsRouter = Router();

//rota não autenticada, ainda ...
postsRouter.get("/posts", getPosts);
postsRouter.post("/posts", postPost);

export default postsRouter;