const catchAsync = require('../middlewares/catchAsync')
const User = require('../models/userModal')

/**
 * 
 * Check for a JWT token
 */
const GetAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        status: 'success',
        message: 'You are authenticated',
        response: {
            results: users.length,
            data: users,
        },
    })
})

module.exports = {
    GetAllUsers,
}
