const ResetPasswordController = (req, res) => {
    res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Your password is changed',
        response: {
            name: 'Sidharth',
        },
    })
}

const SignInController = (req, res) => {
    res.status(200).json({
        status: 'success',
        code: 200,
        message: 'You are authenticated',
        response: {
            name: 'Sidharth',
        },
    })
}

const SignUpController = (req, res) => {
    res.status(200).json({
        status: 'success',
        code: 200,
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
