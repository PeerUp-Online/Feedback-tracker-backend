const mongoose = require('mongoose')
const validator = require('validator').default

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a product name.'],
            trim: true,
        },
        url: {
            trim: true,
            type: String,
            required: [true, 'Please provide a product link'],
            validate: {
                validator: function (url) {
                    return validator.isURL(url)
                },
                message: () => 'Please provide an valid URL',
            },
        },
        image: {
            type: String,
            required: [true, 'Please provide a product image.'],
        },
        description: {
            type: String,
            required: [true, 'Please give a product description.'],
            maxlength: [
                350,
                'Please give a description shorter or equal to 350 letters.',
            ],
        },
        features: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Feature',
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

const Product = mongoose.model('Product', productSchema)

Product.ensureIndexes()

module.exports = Product
