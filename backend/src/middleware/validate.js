/**
 * Joi Schema Validation Middleware
 * @param {Object} schema 
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            errors: {
                wrap: {
                    label: '',
                },
            },
        });

        if (error) {
            const message = error.details.map((details) => details.message).join(', ');
            return res.status(400).json({
                success: false,
                message,
            });
        }

        next();
    };
};

module.exports = validate;
