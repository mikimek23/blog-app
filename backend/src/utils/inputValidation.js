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

const tagsSchema = Joi.alternatives().try(
  Joi.array().items(Joi.string().trim().min(1)),
  Joi.string(),
)

const postStatusSchema = Joi.string().valid('draft', 'scheduled', 'published')
const scheduledForSchema = Joi.alternatives()
  .try(Joi.date().iso(), Joi.date(), Joi.valid(null, ''))
  .optional()

const requireScheduledDate = (value, helpers) => {
  if (value.status !== 'scheduled') return value

  if (!value.scheduledFor) {
    return helpers.message('scheduledFor is required for scheduled posts')
  }

  const scheduledDate = new Date(value.scheduledFor)
  if (Number.isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
    return helpers.message('scheduledFor must be a future datetime')
  }

  return value
}

export const postCreateValidation = Joi.object({
  title: Joi.string().max(200).required().messages({
    'string.max': 'title length must be less than 200 characters!',
    'any.required': 'title is required',
  }),
  content: Joi.when('status', {
    is: 'draft',
    then: Joi.string().allow('').optional(),
    otherwise: Joi.string().min(1).required().messages({
      'string.min': 'content is required',
      'any.required': 'content is required',
    }),
  }),
  tags: tagsSchema.optional(),
  imageUrl: Joi.string().uri().allow(null, '').optional().messages({
    'string.uri': 'Invalid URL format',
  }),
  status: postStatusSchema.default('published'),
  scheduledFor: scheduledForSchema,
}).custom(requireScheduledDate)

export const postUpdateValidation = Joi.object({
  title: Joi.string().max(200).optional().messages({
    'string.max': 'title length must be less than 200 characters!',
  }),
  content: Joi.string().optional(),
  tags: tagsSchema.optional(),
  imageUrl: Joi.string().uri().allow(null, '').optional().messages({
    'string.uri': 'Invalid URL format',
  }),
  status: postStatusSchema.optional(),
  scheduledFor: scheduledForSchema,
})
  .min(1)
  .custom(requireScheduledDate)

export const postListQueryValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'publishedAt', 'scheduledFor', 'title')
    .default('publishedAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  cursor: Joi.string().optional(),
  author: Joi.string().trim().optional(),
  tag: Joi.string().trim().optional(),
  search: Joi.string().trim().allow('').optional(),
  status: Joi.string()
    .valid('all', 'draft', 'scheduled', 'published')
    .default('published'),
})

export const adminPostListQueryValidation = postListQueryValidation.keys({
  status: Joi.string()
    .valid('all', 'draft', 'scheduled', 'published')
    .default('all'),
})

export const commentCreateValidation = Joi.object({
  content: Joi.string().trim().min(2).max(1200).required().messages({
    'string.min': 'Comment must contain at least 2 characters',
    'string.max': 'Comment must be at most 1200 characters',
    'any.required': 'Comment content is required',
  }),
})

export const commentFlagValidation = Joi.object({
  reason: Joi.string().trim().max(500).allow('').optional(),
})

export const moderationQueryValidation = Joi.object({
  status: Joi.string()
    .valid('all', 'pending', 'approved', 'rejected')
    .default('pending'),
  flaggedOnly: Joi.boolean().default(false),
  limit: Joi.number().integer().min(1).max(50).default(20),
  cursor: Joi.string().optional(),
})

export const moderationUpdateValidation = Joi.object({
  status: Joi.string().valid('approved', 'rejected', 'pending').required(),
})

export const profileUpdateValidation = Joi.object({
  bio: Joi.string().trim().max(280).allow('').optional(),
  avatarUrl: Joi.string().uri().allow('').optional(),
}).min(1)

export const profileQueryValidation = Joi.object({
  limit: Joi.number().integer().min(1).max(50).default(10),
  cursor: Joi.string().optional(),
})

export const usersAdminQueryValidation = Joi.object({
  search: Joi.string().trim().allow('').optional(),
  limit: Joi.number().integer().min(1).max(50).default(20),
  cursor: Joi.string().optional(),
})

export const userRoleUpdateValidation = Joi.object({
  role: Joi.string().valid('user', 'admin').required(),
})

export const userStatusUpdateValidation = Joi.object({
  isActive: Joi.boolean().required(),
})
