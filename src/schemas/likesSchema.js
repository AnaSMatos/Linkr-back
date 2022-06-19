import joi from "joi";

const likesSchema = joi.object({
  postId: joi.number().integer().required(),
});

export default likesSchema;
