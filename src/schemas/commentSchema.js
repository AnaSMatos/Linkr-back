import joi from "joi";

export const commentSchema = joi.object({
  postId: joi.number().integer().required(),
  message: joi.string().required(),
});

export const commentSchemaParams = joi.object({
  postId: joi.number().integer().required(),
});
