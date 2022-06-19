import {Router} from "express";

import getHashtag from "../controllers/hashtagController.js";
import { authValidator } from "../middlewares/authValidator.js";

const hashtagRouter = Router();

hashtagRouter.get("/hashtag",authValidator, getHashtag);

export default hashtagRouter;