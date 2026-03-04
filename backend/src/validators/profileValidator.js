const Joi = require('joi');

const metricsSchema = Joi.object({
    speed: Joi.number().min(0).max(100),
    verticalLeap: Joi.number().min(0).max(60),
    wingspan: Joi.number().min(0).max(120),
    pointsPerGame: Joi.number().min(0).max(150),
    assists: Joi.number().min(0).max(50),
    stamina: Joi.number().min(0).max(100),
});

const createProfileSchema = Joi.object({
    sportType: Joi.string().required().trim(),
    rawMetrics: metricsSchema.required(),
});

const updateProfileSchema = Joi.object({
    sportType: Joi.string().trim(),
    rawMetrics: metricsSchema,
});

module.exports = {
    createProfileSchema,
    updateProfileSchema,
};
