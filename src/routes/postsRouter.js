import {Router} from "express";

import getPosts from "../controllers/postsController.js";

const postsRouter = Router();

//rota não autenticada, ainda ...
postsRouter.get("/timeline", getPosts);

export default postsRouter;