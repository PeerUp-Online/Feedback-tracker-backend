const catchAsync = require('../helpers/catchAsync')
const ProductService = require('../services/product.service')

const AddFeature = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { title, description, catergory } = req.body
    const user = req.user

    const newFeature = await ProductService.addFeature({
        user,
        id,
        title,
        description,
        catergory,
    })

    res.status(200).json({
        status: 'success',
        message: 'Feature suggestion added.',
        result: newFeature,
    })
})

const GetAllProducts = catchAsync(async (req, res, next) => {
    const list = await ProductService.getAllProducts()

    res.status(200).json({
        status: 'success',
        result: { items: list, count: list.length },
    })
})

const AddNewProduct = catchAsync(async (req, res, next) => {
    const user = req.user
    const { image, name, url, description } = req.body

    const newProduct = await ProductService.addNewProduct({
        user,
        image,
        name,
        url,
        description,
    })

    res.status(200).json({
        status: 'success',
        message: 'Product added successfully',
        result: newProduct,
    })
})

const GetProductById = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const product = await ProductService.getProductById(id)

    res.status(200).json({
        status: 'success',
        result: product,
    })
})

const VoteFeature = async (req, res, next) => {
    const { id } = req.params
    const { type } = req.body

    await ProductService.voteFeature({ id, type })

    if (type === 'downvote') {
        res.status(200).json({
            status: 'success',
            message: 'Feature down voted.',
        })
    } else {
        res.status(200).json({
            status: 'success',
            message: 'Feature up voted.',
        })
    }
}

module.exports = {
    AddFeature,
    GetAllProducts,
    AddNewProduct,
    GetProductById,
    VoteFeature,
}
