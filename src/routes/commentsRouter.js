import {Router} from "express";

import { postComment, getComments, getContComments } from "../controllers/commentsController.js";
import { authValidator } from "../middlewares/authValidator.js";

const commentsRouter = Router();

commentsRouter.post("/comment", authValidator, postComment);
commentsRouter.get("/comments", authValidator, getComments);
commentsRouter.get("/cont-comments", authValidator, getContComments);

export default commentsRouter;