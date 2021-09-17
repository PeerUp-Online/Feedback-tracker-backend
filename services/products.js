const Product = require('../models/productModal')
const catchAsync = require('../utils/catchAsync')
const verifyToken = require('../utils/verifyToken')
const User = require('../models/userModal')
const Feature = require('../models/featureModal')
const AppError = require('../utils/appError')

const GetAllProducts = catchAsync(async (req, res, next) => {
    const list = await Product.find().populate('features')

    res.status(200).json({
        status: 'success',
        data: list,
    })
})

const VoteFeature = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { type } = req.body

    if (type === 'downVote') {
        await Feature.findByIdAndUpdate(id, {
            $inc: { votes: -1 },
        })

        res.status(200).json({
            status: 'success',
            message: 'Feature down voted.',
        })
    } else {
        await Feature.findByIdAndUpdate(id, {
            $inc: { votes: 1 },
        })

        res.status(200).json({
            status: 'success',
            message: 'Feature up voted.',
        })
    }
})

const AddFeature = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { title, description, catergory } = req.body

    const user = await verifyToken(req.headers.authorization.split(' ')[1])

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

    res.status(200).json({
        status: 'success',
        message: 'Feature suggestion added.',
        data: newFeature,
    })
})

const GetProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const product = await Product.findById(id)

    if (!product) {
        next(new AppError('No Product found with the given ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: product,
    })
})

const AddNewProduct = catchAsync(async (req, res, next) => {
    const { image, name, url, description } = req.body

    const user = await verifyToken(req.headers.authorization.split(' ')[1])

    const newProduct = await Product.create({
        image,
        name,
        url,
        description,
    })

    await User.findByIdAndUpdate(user.id, {
        $push: { addedProducts: newProduct.id },
    })

    res.status(200).json({
        status: 'success',
        message: 'Product added successfully',
        data: newProduct,
    })
})

module.exports = {
    GetAllProducts,
    AddNewProduct,
    GetProductById,
    AddFeature,
    VoteFeature,
}
