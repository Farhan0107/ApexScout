const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().required().trim().min(3).max(50),
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required().min(6),
    role: Joi.string().required().valid('athlete', 'scout'),
});

const loginSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
});

module.exports = {
    registerSchema,
    loginSchema,
};
