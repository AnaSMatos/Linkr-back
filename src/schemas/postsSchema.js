import joi from "joi";

export const postPostSchema = joi.object({
  message: joi.string().required(),
  url: joi.string().required(),
  userId: joi.number().required(),
  hashtags: joi.array()
});

export const putPostSchema = joi.object({
  message: joi.string().required(),
  postId: joi.number().required()
});
