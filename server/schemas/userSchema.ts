import {Joi} from "express-validation";

const registerSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    avatar: Joi.string(),
    videos: Joi.array(),
  }),
};

const loginSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export { registerSchema, loginSchema };