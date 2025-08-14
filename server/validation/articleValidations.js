const Joi = require("joi");

const validateObjectId = (id, errorMessage = 'Invalid ID format') => {
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error(errorMessage);
  }
};

const articleIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.hex': 'ID must be a valid hexadecimal string',
    'string.length': 'ID must be exactly 24 characters long',
    'any.required': 'Article ID is required'
  })
});

const createArticleSchema = Joi.object({
  title: Joi.string()
    .label('title')
    .min(3)
    .max(150)
    .trim()
    .required()
    .messages({
      'string.base': 'title must be a string',
      'string.empty': 'title is required',
      'string.min': 'title must be at least {#limit} characters long',
      'string.max': 'title cannot be more than {#limit} characters long',
      'any.required': 'title is required'
    }),

  content: Joi.string()
    .label('content')
    .min(10)
    .trim()
    .required()
    .messages({
      'string.base': 'content must be a string',
      'string.empty': 'content is required',
      'string.min': 'content must be at least {#limit} characters long',
      'any.required': 'content is required'
    }),

  status: Joi.string()
    .valid('draft', 'published')
    .default('draft')
    .messages({
      'any.only': 'status must be either draft or published'
    }),
});

const updateArticleSchema = Joi.object({
  title: Joi.string()
    .label('title')
    .min(3)
    .max(150)
    .trim()
    .optional()
    .messages({
      'string.base': 'title must be a string',
      'string.min': 'title must be at least {#limit} characters long',
      'string.max': 'title cannot be more than {#limit} characters long',
    }),

  content: Joi.string()
    .label('content')
    .min(10)
    .trim()
    .optional()
    .messages({
      'string.base': 'content must be a string',
      'string.min': 'content must be at least {#limit} characters long',
    }),

  status: Joi.string()
    .valid('draft', 'published')
    .optional()
    .messages({
      'any.only': 'status must be either draft or published'
    }),
})
.min(1)
.messages({
  'object.min': 'At least one field (title, content, or status) must be provided for an update.'
});

module.exports = { createArticleSchema, updateArticleSchema , validateObjectId};
