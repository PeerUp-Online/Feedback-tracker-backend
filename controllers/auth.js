
const ResetPasswordController = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Your password is changed',
        response: {
            name: 'Sidharth',
        },
    })
}

const SignInController = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'You are authenticated',
        response: {
            name: 'Sidharth',
        },
    })
}

const SignUpController = async (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Account created successfully',
        response: {
            name: 'Sidharth',
        },
    })
}

module.exports = {
    SignInController,
    SignUpController,
    ResetPasswordController,
}
