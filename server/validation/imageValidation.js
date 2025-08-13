const Joi = require('joi');

const imageUploadValidation = {
  body: Joi.object({
    userId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/) 
      .required()
      .messages({
        'string.pattern.base': 'Invalid user ID format',
        'any.required': 'User ID is required'
      }),
    description: Joi.string()
      .max(200)
      .optional()
      .messages({
        'string.max': 'Description cannot exceed 200 characters'
      })
  }),
  file: (file) => {
    if (!file) {
      throw new Error('Image file is required');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    if (!allowedMimes.includes(file.mimetype)) {
      throw new Error('Only JPEG, PNG, GIF, and WEBP images are allowed');
    }

    return true;
  }
};

module.exports = { imageUploadValidation };