const Joi = require("joi");

const signupSchema = Joi.object({
  first_name: Joi.string().min(3).max(30).required().messages({
    "string.base": `first_name should be a type of 'text'`,
    "string.empty": `first_name cannot be an empty field`,
    "string.min": `first_name should have a minimum length of {#limit}`,
    "any.required": `first_name is a required field`
  }),
  last_name: Joi.string().min(3).max(30).required().messages({
    "string.base": `last_name should be a type of 'text'`,
    "string.empty": `last_name cannot be an empty field`,
    "string.min": `last_name should have a minimum length of {#limit}`,
    "any.required": `last_name is a required field`
  }),
  email: Joi.string().email()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) // regex
    .required()
    .messages({
      "string.email": `email must be a valid email`,
      "string.pattern.base": `email format is invalid`,
      "string.empty": `email cannot be empty`,
      "any.required": `email is required`
    })
});
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": `email must be a valid email address`,
      "string.empty": `email cannot be empty`,
      "any.required": `email is required`
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": `password should have a minimum length of 6 characters`,
      "string.empty": `password cannot be empty`,
      "any.required": `password is required`
    })
});

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  // If validation passes, continue to next middleware/controller
  next();
};

const setPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.min": `password should have a minimum length of 6`,
    "string.empty": `password cannot be empty`,
    "any.required": `"password" is required`
  })
});
const validateSetPassword = (req, res, next) => {
  const { error } = setPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

const validatesignup = (req, res,next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  } 
  next();
  
};
const updateProfileSchema = Joi.object({
  first_name: Joi.string().trim().min(2).optional(),
  last_name: Joi.string().trim().min(2).optional(),
  email: Joi.string().email().trim().optional()
}).min(1).messages({
  'object.min': 'At least one field (first_name, last_name, or email) must be provided.'
});

module.exports = {validatesignup,validateSetPassword,validateLogin,updateProfileSchema};
