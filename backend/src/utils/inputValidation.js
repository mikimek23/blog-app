import Joi from 'joi'

export const IdValidation = Joi.object({
  id: Joi.string()
    .pattern(new RegExp(/^[0-9a-fA-F]{24}$/))
    .required()
    .messages({
      'string.pattern': 'Incorrect Id',
      'any.required': 'Id is required',
    }),
})
export const userRegistrationValidation = Joi.object({
  username: Joi.string().min(3).required().messages({
    'string.min': 'Username must be at least 3 character long',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Please enter a valid email adress',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be minimum 6 character long.',
    'any.required': 'Password is required.s',
  }),
})
export const userLoginValidation = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Please enter a valid email adress',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be minimum 6 character long.',
    'any.required': 'Password is required.s',
  }),
})

export const postValidation = Joi.object({
  title: Joi.string().max(200).required().messages({
    'string.max': 'title length must be less than 200 characters!',
    'any.required': 'title is required',
  }),
  content: Joi.string()
    .required()
    .messages({ 'any.required': 'content is required' }),
  tags: Joi.array().items(Joi.string()).messages({
    'array.items': 'tag must be separated by comma',
  }),
})
