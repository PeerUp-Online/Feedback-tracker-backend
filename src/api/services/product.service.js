const Product = require('../models/product.model')
const catchAsync = require('../helpers/catchAsync')
const verifyToken = require('../helpers/verifyToken')
const User = require('../models/user.model')
const Feature = require('../models/feature.model')
const AppError = require('../helpers/appError')

const getAllProducts = async () => {
    const list = await Product.find().populate('features')

    return list
}

const updateFeature = async ({ id, ...data }) => {
    console.log('data: ', data)
    if (data.type === 'downVote') {
        return await Feature.findByIdAndUpdate(id, {
            $inc: { votes: -1 },
        })
    }
    if (data.type === 'upVote') {
        return await Feature.findByIdAndUpdate(id, {
            $inc: { votes: 1 },
        })
    } else {
        return await Feature.findByIdAndUpdate(id, data, {
            validateBeforeSave: false,
        })
    }
}

const deleteFeature = async ({ id }) => {
    return await Feature.findByIdAndDelete(id)
}

const addFeature = async ({ user, id, title, description, catergory }) => {
    const newFeature = await Feature.create({
        title,
        description,
        catergory,
        product: id,
        createdBy: { id: user.id, name: user.name },
    })

    await Product.findByIdAndUpdate(id, {
        $push: { features: newFeature.id },
    })

    return newFeature
}

const getProductById = async (id) => {
    const product = await Product.findById(id)

    if (!product) {
        throw new AppError('No Product found with the given ID', 404)
    }

    return product
}

const addNewProduct = async ({ user, image, name, url, description }) => {
    const newProduct = await Product.create({
        image,
        name,
        url,
        createdBy: user.id,
        description,
    })

    await User.findByIdAndUpdate(user.id, {
        $push: { addedProducts: newProduct.id },
    })

    return newProduct
}

module.exports = {
    getAllProducts,
    addNewProduct,
    getProductById,
    addFeature,
    updateFeature,
    deleteFeature,
}
