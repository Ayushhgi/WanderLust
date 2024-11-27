const Joi = require('joi');

// Listing Schema update
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(), // Title required
        description: Joi.string().required(), // Description required
        location: Joi.string().required(), // Location required
        country: Joi.string().required(), // Country required
        price: Joi.number().required().min(0), // Price should be a number, required, and non-negative
        image: Joi.string().allow('', null), // Image can be a string, allow empty or null values
    }).required()
});

// Review Schema (no changes needed, but updated for consistency)
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), // Rating should be between 1 and 5
        comment: Joi.string().required(), // Comment is required
    }).required(),
});
