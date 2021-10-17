const catchAsync = require('../helpers/catchAsync')

const getCurrentUser = catchAsync(async (req, res, next) => {
    const user = req.user

    res.status(200).json({
        status: 'success',
        data: { user },
    })
})

module.exports = {
    getCurrentUser,
}
