const { Router } = require('express')
const checkAuth = require('../middlewares/auth.middleware')
const productController = require('../controllers/product.controller')

const ProductRouter = Router()

/**
 * ? get / get a product data by ID
 */
ProductRouter.route('/:id').get(productController.GetProductById)

// Check for auth headers

ProductRouter.use(checkAuth)

/**
 * ? PATCH / add feature to a product
 */
ProductRouter.route('/:id/feature').post(
    productController.createFeature
)

ProductRouter.route('/feature/:id').patch(
    productController.updateFeature
)

ProductRouter.route('/feature/:id').delete(
    productController.deleteFeature
)

/**
 * ? GET / Getall products route, returns list of all products.
 */
ProductRouter.route('/').get(productController.GetAllProducts)

/**
 * ? POST / add a new product
 */
ProductRouter.route('/').post(productController.AddNewProduct)

module.exports = ProductRouter
