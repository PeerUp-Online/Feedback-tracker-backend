const { Router } = require('express')
const checkAuth = require('../middlewares/checkAuth')
const {
    GetAllProducts,
    AddNewProduct,
    GetProductById,
    AddFeature,
    VoteFeature,
} = require('../services/products')

const ProductRouter = Router()

/**
 * ? get / get a product data by ID
 */
ProductRouter.route('/:id').get(GetProductById)

// Check for auth headers
ProductRouter.use(checkAuth)

/**
 * ? PATCH / add feature to a product
 */
ProductRouter.route('/:id').patch(AddFeature)

ProductRouter.route('/:id/vote').patch(VoteFeature)

/**
 * ? GET / Getall products route, returns list of all products.
 */
ProductRouter.route('/').get(GetAllProducts)

/**
 * ? POST / add a new product
 */
ProductRouter.route('/addnew').post(AddNewProduct)

module.exports = ProductRouter
