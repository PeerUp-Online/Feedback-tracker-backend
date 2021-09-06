const { Router } = require('express')
const { GetAllProducts } = require('../controllers/products')

const ProductRouter = Router()

/**
 * ? GET / Getall products route, returns list of all products.
 */
ProductRouter.route('/').get(GetAllProducts)

module.exports = ProductRouter
