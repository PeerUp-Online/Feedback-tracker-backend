const mongoose = require('mongoose')

const featureSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please give a feature title'],
        },
        completed: {
            type: Boolean,
            default: false,
        },
        votes: {
            type: Number,
            default: 0,
        },
        totalFeatures: {
            type: Number,
        },
        completedFeatures: {
            type: Number,
        },

        description: {
            type: String,
            maxlength: 350,
            required: true,
        },
        catergory: [{ type: String, trim: true }],
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: [true, 'A Feature must belong to a Product.'],
        },
        createdBy: {
            type: Object,
            required: [true, 'A Feature must be created by an User.'],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

const Feature = mongoose.model('Feature', featureSchema)

Feature.ensureIndexes()

module.exports = Feature
