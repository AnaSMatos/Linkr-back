import {Router} from "express";

import {getHashtag, postHashtag} from "../controllers/hashtagController.js";
import { authValidator } from "../middlewares/authValidator.js";

const hashtagRouter = Router();

hashtagRouter.get("/hashtag",authValidator, getHashtag);
hashtagRouter.post("/hashtag",authValidator, postHashtag);

export default hashtagRouter;