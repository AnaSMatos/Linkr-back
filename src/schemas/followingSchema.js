import joi from "joi";

const followingSchema = joi.object({
  id: joi.number().integer().required(),
});

export default followingSchema;
