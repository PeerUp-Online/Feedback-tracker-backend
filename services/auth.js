const catchAsync = require('../middlewares/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModal')
const signToken = require('../utils/signToken')

/**
 * Sign in the user whenever they come back.
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

const ResetPassword = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Your password is changed',
        response: {
            name: 'Sidharth',
        },
    })
}

/**
 * Sign in the user whenever they come back.
 * Check for a JWT token
 */
const SignIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    // Check if req contains an`email` and `password`
    if (!email || !password) {
        return next(new AppError(`Please provide an emaill and password.`, 400))
    }

    const user = await User.findOne({ email }).select('+password')

    // Verify if req `password` matches the user password.
    if (!user || !(await user.verifyPassword(password, user.password))) {
        return next(new AppError(`Incorrect email or password.`, 401))
    }

    const token = signToken({ id: user._id })

    res.status(200).json({
        status: 'success',
        message: 'You are authenticated',
        response: {
            token,
        },
    })
})

/**
 * Sign up the user for the first time.
 * Store it in the DB, return a JWT
 */
const SignUp = catchAsync(async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })

    await User.ensureIndexes()

    const token = signToken({ id: user._id })

    res.status(200).json({
        status: 'success',
        message: 'Account created successfully',
        response: { user, token },
    })
})

module.exports = {
    SignIn,
    SignUp,
    ResetPassword,
    GetAllUsers,
}
